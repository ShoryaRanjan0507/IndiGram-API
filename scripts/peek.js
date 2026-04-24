const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function peekHeaders() {
  const dirPath = './data.csv';
  const firstXls = 'villageofSpecificState2026_04_23_23_28_11_526.xls';

  if (!firstXls) {
    console.error('No .xls files found.');
    return;
  }

  const workbook = XLSX.readFile(path.join(dirPath, firstXls));
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log('Sample Data (First 10 rows):');
  for (let i = 0; i < 10; i++) {
    console.log(JSON.stringify(data[i]));
  }
}

peekHeaders();
