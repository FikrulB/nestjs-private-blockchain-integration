import { Controller, Post, UseInterceptors } from "@nestjs/common"
import { EthersService } from "./ethers.service"
import { LoggingInterceptor } from "@/common/interceptors/logging.interceptor"


@Controller("ethers")
@UseInterceptors(LoggingInterceptor)
export class EthersController {
    constructor(private ethersService: EthersService) {}

    // @Post("record")
    // async recordLog() {
    //     return await this.ethersService.recordLog("test")
    // }
}