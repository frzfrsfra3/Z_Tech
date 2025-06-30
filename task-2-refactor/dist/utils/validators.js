// utils/validators.ts
export function validatePropertyRow(row, rowIndex) {
    const errors = [];
    if (!row.title || typeof row.title !== 'string' || row.title.trim() === '') {
        errors.push(`Row ${rowIndex}: Invalid or missing title.`);
    }
    const price = parseFloat(row.price);
    if (isNaN(price) || price <= 0) {
        errors.push(`Row ${rowIndex}: Price must be a positive number.`);
    }
    if (!row.projectId || typeof row.projectId !== 'string' || row.projectId.trim() === '') {
        errors.push(`Row ${rowIndex}: Invalid or missing projectId.`);
    }
    return {
        valid: errors.length === 0,
        errors: errors.length ? errors : undefined,
    };
}
