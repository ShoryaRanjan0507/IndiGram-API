const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function peekPincodes() {
  const filePath = './data.csv/All INDIA PINCODES.xlsx';
  if (!fs.existsSync(filePath)) {
    console.error('Pincode file not found');
    return;
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log('Sample Pincode Data (First 10 rows):');
  for (let i = 0; i < 10; i++) {
    console.log(JSON.stringify(data[i]));
  }
}

peekPincodes();
