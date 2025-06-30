import fs from 'fs';
import csv from 'csv-parser';
import { Property } from '../models/property.model.js'; // Add .js extension
import { validatePropertyRow } from '../utils/validators.js'; // Add .js extension
export const importPropertiesCSV = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    // if (!req.user?.id) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }
    const filePath = req.file.path;
    const BATCH_SIZE = 500;
    let batch = [];
    const errors = [];
    let totalRows = 0;
    let validRows = 0;
    try {
        const stream = fs.createReadStream(filePath).pipe(csv());
        stream.on('data', async (row) => {
            totalRows++;
            const { valid, errors: rowErrors } = validatePropertyRow(row, totalRows);
            if (!valid) {
                errors.push(...(rowErrors || []));
                return;
            }
            const prepared = {
                title: row.title.trim(),
                price: parseFloat(row.price),
                projectId: row.projectId.trim(),
                // brokerId: req.user.id,
                createdAt: new Date(),
            };
            batch.push(prepared);
            validRows++;
            if (batch.length >= BATCH_SIZE) {
                stream.pause();
                await Property.insertMany(batch, { ordered: false }).catch(err => {
                    errors.push(`Batch insert error: ${err.message}`);
                });
                batch = [];
                stream.resume();
            }
        });
        stream.on('end', async () => {
            if (batch.length > 0) {
                await Property.insertMany(batch, { ordered: false }).catch(err => {
                    errors.push(`Final batch insert error: ${err.message}`);
                });
            }
            fs.unlinkSync(filePath);
            return res.status(200).json({
                message: 'Import completed',
                totalRows,
                validRows,
                failedRows: errors.length,
                errors,
            });
        });
        stream.on('error', (err) => {
            fs.unlinkSync(filePath);
            console.error('CSV stream error:', err);
            return res.status(500).json({ error: 'Error reading CSV file.' });
        });
    }
    catch (err) {
        fs.unlinkSync(filePath);
        console.error('Unexpected import error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
