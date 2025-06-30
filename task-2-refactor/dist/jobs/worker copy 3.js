import Queue from "bull";
import { parse } from "csv-parse";
import { MongoClient } from "mongodb";
import { io } from "../index.js";
import dotenv from "dotenv";
dotenv.config();
// MongoDB connection
const mongoClient = new MongoClient(process.env.MONGODB_URI);
const db = mongoClient.db();
const propertiesCollection = db.collection("properties");
export const propertyImportQueue = new Queue("propertyImportQueue", {
    redis: process.env.REDIS_URL,
    limiter: {
        max: 5, // Reduce max jobs to prevent overload
        duration: 1000 // Per 1 second
    }
});
export const initPropertyImportWorker = async () => {
    try {
        await mongoClient.connect();
        console.log("✅ Connected to MongoDB for property imports");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
    propertyImportQueue.process(async (job) => {
        try {
            const { fileBuffer, brokerId } = job.data;
            io.emit("importStarted", {
                jobId: job.id,
                brokerId,
                status: "processing"
            });
            // Parse CSV with streaming
            const parser = parse(fileBuffer.toString(), {
                columns: true,
                skip_empty_lines: true,
                trim: true,
                cast: (value, context) => {
                    if (context.header)
                        return value;
                    if (context.column === "price") {
                        const num = Number(value);
                        if (isNaN(num) || num <= 0)
                            throw new Error(`Invalid price: ${value}`);
                        return num;
                    }
                    return value;
                }
            });
            const validRecords = [];
            const invalidRecords = [];
            let rowNumber = 0;
            for await (const record of parser) {
                rowNumber++;
                try {
                    // Validate required fields
                    if (!record.title || !record.projectId || !record.price) {
                        throw new Error("Missing required fields");
                    }
                    // Additional validation
                    if (record.title.length > 255) {
                        throw new Error("Title too long");
                    }
                    validRecords.push({
                        title: record.title,
                        price: record.price,
                        projectId: record.projectId,
                        brokerId,
                        createdAt: new Date(),
                        status: "imported"
                    });
                }
                catch (error) {
                    invalidRecords.push({
                        row: rowNumber,
                        data: record,
                        error: error.message,
                        status: "failed"
                    });
                }
            }
            // Bulk insert only valid records
            if (validRecords.length > 0) {
                const result = await propertiesCollection.bulkWrite(validRecords.map(record => ({
                    insertOne: { document: record }
                })), { ordered: false });
                io.emit("importProgress", {
                    jobId: job.id,
                    processed: rowNumber,
                    valid: validRecords.length,
                    invalid: invalidRecords.length
                });
            }
            return {
                totalRecords: rowNumber,
                importedCount: validRecords.length,
                failedCount: invalidRecords.length,
                failedRecords: invalidRecords
            };
        }
        catch (error) {
            console.error(`❌ Error processing import job ${job.id}:`, error);
            throw error; // Will trigger the failed event
        }
    });
    // Event handlers
    propertyImportQueue.on("completed", (job, result) => {
        io.emit("importCompleted", {
            jobId: job.id,
            ...result,
            status: "completed"
        });
        console.log(`✅ Property import ${job.id} completed. 
      Success: ${result.importedCount}, 
      Failed: ${result.failedCount}`);
    });
    propertyImportQueue.on("failed", (job, error) => {
        io.emit("importFailed", {
            jobId: job.id,
            error: error.message,
            status: "failed"
        });
        console.error(`❌ Property import ${job.id} failed:`, error.message);
    });
    propertyImportQueue.on("waiting", (jobId) => {
        io.emit("importQueued", { jobId, status: "queued" });
    });
    console.log("✅ Property import queue worker initialized");
};
