import { Module } from '@nestjs/common'
import { PrismaModule } from '@/libs/prisma/prisma.module'
import { EthersModule } from '@/libs/ethers/ethers.module'

@Module({
  imports: [PrismaModule, EthersModule],
})
export class GlobalModule {}
