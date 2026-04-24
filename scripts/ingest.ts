import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import readline from 'readline';

const prisma = new PrismaClient();

async function main() {
  const filePath = './data.csv';
  if (!fs.existsSync(filePath)) {
    console.error('Error: data.csv not found in the root directory.');
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let count = 0;
  let batch: any[] = [];
  const BATCH_SIZE = 1000;

  console.log('Starting ingestion of 600,000+ entries...');

  for await (const line of rl) {
    // Skip header or empty lines
    if (count === 0 || !line.trim()) {
      count++;
      continue;
    }

    // Assuming CSV format: Name,District,SubDistrict,State,Pincode
    const [name, district, subDistrict, state, pincode] = line.split(',');

    batch.push({
      name: name?.trim(),
      district: district?.trim(),
      subDistrict: subDistrict?.trim(),
      state: state?.trim(),
      pincode: pincode?.trim()
    });

    if (batch.length >= BATCH_SIZE) {
      await prisma.village.createMany({
        data: batch,
        skipDuplicates: true
      });
      console.log(`Ingested ${count} entries...`);
      batch = [];
    }

    count++;
  }

  // Final batch
  if (batch.length > 0) {
    await prisma.village.createMany({
      data: batch,
      skipDuplicates: true
    });
  }

  console.log(`Successfully ingested ${count} entries into the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
