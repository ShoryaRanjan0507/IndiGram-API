const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address: node set-admin.js user@example.com');
  process.exit(1);
}

async function main() {
  const user = await prisma.user.update({
    where: { email: email },
    data: { role: 'ADMIN' },
  });
  console.log(`Successfully upgraded ${user.email} to ADMIN role.`);
}

main()
  .catch(e => {
    console.error('Error: User not found or database connection failed.');
    console.error(e.message);
  })
  .finally(async () => await prisma.$disconnect());
