import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

function peekHeaders() {
  const dirPath = './data.csv/dataset';
  const files = fs.readdirSync(dirPath);
  const firstXls = files.find(f => f.endsWith('.xls'));

  if (!firstXls) {
    console.error('No .xls files found.');
    return;
  }

  const workbook = XLSX.readFile(path.join(dirPath, firstXls));
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  console.log('Headers for', firstXls, ':');
  console.log(data[0]); // Header row
  console.log('Sample Row:');
  console.log(data[1]);
}

peekHeaders();
