const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const filePath = './data.csv/All INDIA PINCODES.xlsx';
  if (!fs.existsSync(filePath)) {
    console.error('Pincode file not found');
    return;
  }

  console.log('Ingesting Pincodes...');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  let batch = [];
  const BATCH_SIZE = 1000;
  let count = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 8) continue;

    batch.push({
      officeName: String(row[3]).trim(),
      pincode: String(row[4]).trim(),
      district: String(row[7]).trim(),
      state: String(row[8]).trim(),
    });

    if (batch.length >= BATCH_SIZE) {
      await prisma.pincodeMapping.createMany({ data: batch });
      count += batch.length;
      process.stdout.write(`\rIngested ${count} pincodes...`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await prisma.pincodeMapping.createMany({ data: batch });
  }

  console.log(`\nSuccessfully ingested ${count} pincodes.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
