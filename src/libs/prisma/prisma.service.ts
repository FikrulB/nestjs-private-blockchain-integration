import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ExtendedPrismaClient } from '@/libs/prisma/prisma.extended'

@Injectable()
export class PrismaService
  extends ExtendedPrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
