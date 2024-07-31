import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/user.seeder';

const prisma = new PrismaClient();

async function main() {
  try {
    await seedUsers();

    console.info('Successfully seeding data!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
