// utils/validators.ts

export interface PropertyRow {
  title: string;
  price: string;
  projectId: string;
}

export function validatePropertyRow(row: PropertyRow, rowIndex: number): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

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
