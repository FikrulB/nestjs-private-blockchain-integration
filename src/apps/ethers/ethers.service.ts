import { HttpStatus, Injectable } from "@nestjs/common";
import { ethers } from "ethers";

import generalUserLoggingABI from "./abi/GeneralLogging"
import adminableABI from "./abi/adminable"
import { CustomException } from "@/common/exceptions/custom.exceptions";
import { ERROR_CODES } from "@/common/constants/error-messages";

@Injectable()
export class EthersService {
    private provider: ethers.JsonRpcProvider
    private wallet: ethers.Wallet;
    private contractAdminable: ethers.Contract;
    private contractGeneralLogging: ethers.Contract;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.GNC_RPC_PROVIDER)
        this.wallet = new ethers.Wallet(process.env.GNC_PRIVATE_KEY, this.provider)

        this.contractAdminable = new ethers.Contract(process.env.SC_ADMINABLE, adminableABI, this.wallet);
        this.contractGeneralLogging = new ethers.Contract(process.env.SC_GENERAL_USER_LOGGING, generalUserLoggingABI, this.wallet);
    }

    toBytes32(str: string): string {
        const buffer = Buffer.alloc(32);
        buffer.write(str);
        return '0x' + buffer.toString('hex');
    }

    async recordLog() {
        try {
            let params = {
                activity: this.toBytes32("register"),
                interactTo: ethers.ZeroAddress,
                userAddress: this.wallet.address,
                userId: this.toBytes32("1"),
                userEmail: this.toBytes32("pepe@gmail.com"),
                userAgent: this.toBytes32("chrome"),
                userIp: this.toBytes32("127.0.0.1"),
                data: this.toBytes32("some data"),
            };
            
            let result = await this.contractGeneralLogging.recordLog(params);

            return {
                data: result.data
            }
        } catch (error) {
            throw new CustomException(
                error.message,
                ERROR_CODES.INTERNAL_SERVER_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
        }
    }
}