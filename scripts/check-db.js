const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCount() {
  try {
    const count = await prisma.village.count();
    console.log(`Villages in database: ${count}`);
  } catch (error) {
    console.error('Error connecting to database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCount();
