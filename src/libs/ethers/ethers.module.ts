import { Module } from "@nestjs/common"
import { EthersService } from "./ethers.service"
import { EthersController } from "./ethers.controller"
import { LogActivityModule } from "../../apps/log-activity/log-activity.module"

@Module({
    imports: [LogActivityModule],
    providers: [EthersService],
    exports: [EthersService],
    controllers: [EthersController]
})

export class EthersModule {}