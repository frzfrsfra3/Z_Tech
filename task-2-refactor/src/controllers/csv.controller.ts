import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { csvQueue } from "../jobs/worker.js";
import { redisClient } from "../redis.js";
import { validatePropertyRow } from "../utils/validators.js";
import { Property } from "../models/property.model.js";

interface PropertyCSVRow {
  title: string;
  price: string;
  projectId: string;
}

export const processCSVFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const filePath = req.file.path;
  const BATCH_SIZE = 1000;

  let batch: PropertyCSVRow[] = [];
  const errors: string[] = [];
  let totalProcessed = 0;
  let validRows = 0;
  let failedRows = 0;

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: any) => {
        // Normalize keys for robustness
        const title = data.title ?? data.Title ?? data.TITLE ?? "";
        const price = data.price ?? data.Price ?? data.PRICE ?? "";
        const projectId = data.projectId ?? data.projectid ?? data.project_id ?? data.PROJECTID ?? data.projectID ?? "";

        // --- Robust Validation ---
        // Title: must be a non-empty string after trimming
        if (typeof title !== "string" || title.trim() === "") {
          errors.push(`Row ${totalProcessed + validRows + failedRows + 1}: Title cannot be empty`);
          failedRows++;
          return;
        }

        // Price: must be a positive number
        const priceNumber = typeof price === "number" ? price : parseFloat(price);
        if (isNaN(priceNumber) || priceNumber <= 0) {
          errors.push(`Row ${totalProcessed + validRows + failedRows + 1}: Price must be a positive number`);
          failedRows++;
          return;
        }

        // Optionally, validate projectId if needed
        // if (typeof projectId !== "string" || projectId.trim() === "") {
        //   errors.push(`Row ${totalProcessed + validRows + failedRows + 1}: Project ID cannot be empty`);
        //   failedRows++;
        //   return;
        // }

        // If all validations pass, add to batch
        batch.push({ title, price, projectId });
        validRows++;

        if (batch.length >= BATCH_SIZE) {
          csvQueue.add({ type: "batch", records: batch });
          totalProcessed += batch.length;
          batch = [];
        }
      })
      .on("end", () => {
        if (batch.length > 0) {
          csvQueue.add({ type: "batch", records: batch });
          totalProcessed += batch.length;
        }

        fs.unlinkSync(filePath);

        res.status(200).json({
          message: "CSV processing completed",
          totalRecords: totalProcessed + failedRows,
          validRows,
          failedRows,
          errors,
        });
      })
      .on("error", (error) => {
        console.error("CSV processing error:", error);
        fs.unlinkSync(filePath);
        res.status(500).json({ error: "Error processing CSV file" });
      });

  } catch (err: any) {
    fs.unlinkSync(filePath);
    console.error("Unexpected import error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
