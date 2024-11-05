import { PrismaClient } from '@prisma/client'
import { seedUsers } from './seeders/user.seeder'
import { ConfigService } from "@nestjs/config"
import { config } from 'dotenv'
config()

const prisma = new PrismaClient()
const configService = new ConfigService()

async function main() {
  try {
    await seedUsers(configService)
    console.info('Successfully seeding data!')
  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
