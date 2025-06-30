import Queue from "bull";
import axios from "axios";
import dotenv from "dotenv";
import { io } from "../index.js";
dotenv.config();
export const csvQueue = new Queue("csvQueue", {
    redis: process.env.REDIS_URL,
});
const isWorkerInitialized = false; // Prevent multiple registrations
export const initQueueWorker = () => {
    if (isWorkerInitialized) {
        console.log("⚠️ Queue worker already initialized. Skipping.");
        return;
    }
    csvQueue.process(async (job) => {
        try {
            io.emit("jobProcessing", { id: job.id, data: job.data });
            const { name, email } = job.data;
            const response = await axios.post("https://jsonplaceholder.typicode.com/users", { name, email });
            io.emit("jobCompleted", { id: job.id, result: response.data });
            console.log(`✅ User ${name} added: `, response.data);
        }
        catch (error) {
            io.emit("jobFailed", { id: job.id, error: error.message });
            console.error(`❌ Error processing user ${job.data.name}:`, error.message);
        }
    });
    // Emit when a job is added to the queue
    csvQueue.on("waiting", (jobId) => {
        io.emit("jobQueued", { id: jobId });
    });
    console.log("✅ Queue worker initialized.");
};
