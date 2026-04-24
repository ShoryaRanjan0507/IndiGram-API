const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const dirPath = './data.csv';
  const villageFile = 'MA_2022_06122023.csv';
  const filePath = path.join(dirPath, villageFile);

  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${villageFile} not found in data.csv folder.`);
    return;
  }

  console.log(`Starting Turbo Ingestion of ${villageFile} (400MB+)...`);

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let totalIngested = 0;
  let batch = [];
  const BATCH_SIZE = 2000;

  for await (const line of rl) {
    if (!line.trim()) continue;

    // Format is pipe-delimited: 1|JAMMU AND KASHMIR|1|ANANTNAG|1|ACHABAL|242494|Hardpora|...
    const parts = line.split('|');
    if (parts.length < 8) continue;

    const stateName = parts[1];
    const districtName = parts[3];
    const subDistrictName = parts[5];
    const villageName = parts[7];

    batch.push({
      name: String(villageName).trim(),
      district: String(districtName).trim(),
      subDistrict: String(subDistrictName).trim(),
      state: String(stateName).trim(),
    });

    if (batch.length >= BATCH_SIZE) {
      await prisma.village.createMany({
        data: batch
      });
      totalIngested += batch.length;
      process.stdout.write(`\rTotal Ingested: ${totalIngested}`);
      batch = [];
    }
  }

  // Final batch
  if (batch.length > 0) {
    await prisma.village.createMany({
      data: batch
    });
    totalIngested += batch.length;
  }

  console.log(`\nSuccessfully ingested ${totalIngested} villages into the cloud database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
