import { HttpStatus, Injectable } from "@nestjs/common"
import { ethers, NonceManager, TransactionRequest } from "ethers"
import { ConfigService } from "@nestjs/config"
import { RecordLogInterface } from "@/libs/ethers/ethers.interface"
import { CustomException } from "@/common/exceptions/custom.exceptions"
import generalUserLoggingABI from "@/libs/ethers/abi/GeneralLogging"
import adminableABI from "@/libs/ethers/abi/Adminable"

@Injectable()
export class EthersService {
  public readonly zeroAddress: string
  private readonly wallet: ethers.Wallet
  private readonly provider: ethers.JsonRpcProvider
  private transactionRequest: TransactionRequest
  private contractAdminable: ethers.Contract
  private contractGeneralLogging: ethers.Contract
  
  constructor(private readonly config: ConfigService) {
    this.provider = new ethers.JsonRpcProvider(this.config.get('BC_RPC_PROVIDER'))
    this.wallet = new ethers.Wallet(this.config.get('BC_OWNER_PRIVATE_KEY'), this.provider)
    
    const managedSigner = new NonceManager(this.wallet)
    
    this.contractAdminable = new ethers.Contract(this.config.get('SC_ADMINABLE'), adminableABI, managedSigner)
    this.contractGeneralLogging = new ethers.Contract(this.config.get('SC_GENERAL_USER_LOGGING'), generalUserLoggingABI, managedSigner)
    
    this.transactionRequest = {chainId: this.config.get('BC_CHAIN_ID')}
    this.zeroAddress = ethers.ZeroAddress
  }
  
  async onModuleInit() {
    try {
      await this.contractAdminable.isAdmin(this.wallet.address)
    } catch (error) {
      console.log("ERROR INIT => ", error)
      process.exit(1)
    }
  }
  
  toBytes32(str: string): string {
    const buffer = Buffer.alloc(32)
    buffer.write(str)
    return '0x' + buffer.toString('hex')
  }
  
  fromBytes32(bytes: string): string {
    const buffer = Buffer.from(bytes.slice(2), 'hex')
    return buffer.toString('utf8').replace(/\0/g, '')
  }
  
  async recordLog(data: RecordLogInterface) {
    try {
      const result = await this.contractGeneralLogging.recordLog(data, this.transactionRequest)
      
      return {
        data: result,
      }
    } catch (error) {
      console.log('recordLog = ', error)
      throw new CustomException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}