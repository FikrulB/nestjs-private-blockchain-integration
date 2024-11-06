import { Global, Module } from "@nestjs/common"
import { EthersService } from "@/libs/ethers/ethers.service"

@Global()
@Module({
  providers: [EthersService],
  exports: [EthersService],
})

export class EthersModule {}