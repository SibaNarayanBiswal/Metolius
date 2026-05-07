import * as XLSX from 'xlsx';

export function getExcelData(filePath: string, sheetName: string) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
        throw new Error(`Sheet "${sheetName}" not found`);
    }

    return XLSX.utils.sheet_to_json(sheet);
}