const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@indigram.com';
  const password = 'admin@0507';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      plan: 'UNLIMITED'
    },
    create: {
      email,
      name: 'IndiGram Owner',
      password: hashedPassword,
      role: 'ADMIN',
      plan: 'UNLIMITED',
      apiKeys: {
        create: {
          key: 'ig_master_admin_key_2024'
        }
      }
    },
  });

  console.log('--- ADMIN ACCOUNT CREATED ---');
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
  console.log('Role: ADMIN');
  console.log('-----------------------------');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
