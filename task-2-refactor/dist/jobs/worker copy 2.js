import Queue from "bull";
import axios from "axios";
import dotenv from "dotenv";
import { io } from "../index.js";
import { MongoClient } from "mongodb";
dotenv.config();
// MongoDB connection
const mongoClient = new MongoClient(process.env.MONGODB_URI);
const db = mongoClient.db();
const usersCollection = db.collection("users");
export const csvQueue = new Queue("csvQueue", {
    redis: process.env.REDIS_URL,
    limiter: {
        max: 10, // Max jobs processed per interval
        duration: 1000 // Per 1 second
    }
});
const isWorkerInitialized = false;
export const initQueueWorker = async () => {
    if (isWorkerInitialized) {
        console.log("⚠️ Queue worker already initialized. Skipping.");
        return;
    }
    try {
        await mongoClient.connect();
        console.log("✅ Connected to MongoDB");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
    csvQueue.process(async (job) => {
        try {
            const { type, records, name, email } = job.data;
            io.emit("jobProcessing", { id: job.id, data: job.data });
            if (type === "batch") {
                // Bulk insert operation for batches
                const bulkOps = records.map((record) => ({
                    insertOne: {
                        document: {
                            name: record.name,
                            email: record.email,
                            createdAt: new Date()
                        }
                    }
                }));
                const result = await usersCollection.bulkWrite(bulkOps, { ordered: false });
                io.emit("jobCompleted", {
                    id: job.id,
                    result: {
                        insertedCount: result.insertedCount,
                        processedCount: records.length
                    }
                });
                console.log(`✅ Inserted ${result.insertedCount} users`);
            }
            else {
                // Single record processing (fallback)
                const response = await axios.post("https://jsonplaceholder.typicode.com/users", { name, email });
                await usersCollection.insertOne({
                    name,
                    email,
                    createdAt: new Date(),
                    externalId: response.data.id
                });
                io.emit("jobCompleted", { id: job.id, result: response.data });
                console.log(`✅ User ${name} added: `, response.data);
            }
        }
        catch (error) {
            io.emit("jobFailed", { id: job.id, error: error.message });
            console.error(`❌ Error processing job ${job.id}:`, error.message);
            // For batch operations, we might want to retry individual failed records
            if (job.data.type === "batch") {
                const failedRecords = job.data.records.filter((_, i) => error.writeErrors?.some((e) => e.index === i));
                if (failedRecords.length > 0) {
                    console.log(`⚠️ ${failedRecords.length} records failed, retrying individually`);
                    failedRecords.forEach((record) => {
                        csvQueue.add({
                            name: record.name,
                            email: record.email
                        });
                    });
                }
            }
        }
    });
    csvQueue.on("waiting", (jobId) => {
        io.emit("jobQueued", { id: jobId });
    });
    csvQueue.on("completed", (job) => {
        console.log(`Job ${job.id} completed`);
    });
    csvQueue.on("failed", (job, err) => {
        console.error(`Job ${job.id} failed:`, err);
    });
    console.log("✅ Queue worker initialized.");
};
