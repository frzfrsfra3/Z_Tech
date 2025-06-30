import fs from "fs";
import csv from "csv-parser";
import { csvQueue } from "../jobs/worker.js";
export const processCSVFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const filePath = req.file.path;
        const batchSize = 1000; // Process in batches of 1000
        let currentBatch = [];
        let totalProcessed = 0;
        // Stream the CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
            const row = {
                name: data.name || data.Name || data.NAME || "",
                email: data.email || data.Email || data.EMAIL || "",
            };
            if (row.name && row.email) {
                currentBatch.push(row);
                if (currentBatch.length >= batchSize) {
                    // Add batch to queue
                    csvQueue.add({ type: "batch", records: currentBatch });
                    totalProcessed += currentBatch.length;
                    currentBatch = [];
                }
            }
        })
            .on("end", () => {
            // Process remaining records in the last batch
            if (currentBatch.length > 0) {
                csvQueue.add({ type: "batch", records: currentBatch });
                totalProcessed += currentBatch.length;
            }
            // Clean up the uploaded file
            fs.unlinkSync(filePath);
            res.status(200).json({
                message: "CSV processing started",
                totalRecords: totalProcessed,
            });
        })
            .on("error", (error) => {
            console.error("CSV processing error:", error);
            fs.unlinkSync(filePath);
            res.status(500).json({ error: "Error processing CSV file" });
        });
    }
    catch (error) {
        console.error("Error in processCSVFile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
