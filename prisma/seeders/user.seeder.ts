import { PrismaClient, Roles } from "@prisma/client"
import { v4 as uuidV4 } from "uuid"
import { hashPassword } from "../../src/common/utils/hash.utils"
import { ConfigService } from "@nestjs/config"

const prisma = new PrismaClient()

export const seedUsers = async (config: ConfigService) => {
  console.info("Seeding users...")
  
  // Create some users
  const user = await prisma.users.upsert({
    where: { email: "lynne@mail.me" },
    update: {
      role: Roles.OWNER,
      accountBcAddress: config.get("BC_OWNER_ADDRESS")
    },
    create: {
      id: uuidV4(),
      fullName: "Lynne",
      role: Roles.OWNER,
      email: "lynne@mail.me",
      emailVerifiedAt: new Date(),
      password: await hashPassword("password"),
      accountBcAddress: config.get("BC_OWNER_ADDRESS")
    }
  })
}
