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
      accountBcAddress: config.get("BC_OWNER_ADDRESS")
    },
    create: {
      id: uuidV4(),
      fullName: "Lynne",
      email: "lynne@mail.me",
      emailVerifiedAt: new Date(),
      password: await hashPassword("password"),
      accountBcAddress: config.get("BC_OWNER_ADDRESS")
    }
  })

  // Check user role
  const existingRoleAccess = await prisma.userRoleAccess.findFirst({
    where: {
      userID: user.id,
      role: Roles.OWNER
    }
  })
  
  if (!existingRoleAccess) {
    // Create role access to user
    await prisma.userRoleAccess.create({
      data: {
        userID: user.id,
        role: Roles.OWNER
      }
    })
  }
}
