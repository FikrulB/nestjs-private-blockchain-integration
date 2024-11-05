import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GlobalModule } from '@/global.module'
import { AuthModule } from '@/apps/auth/auth.module'
import { LogActivityModule } from '@/apps/log-activity/log-activity.module'
import { UserController } from '@/apps/user/user.controller'
import { UserService } from '@/apps/user/user.service'
import { UserModule } from '@/apps/user/user.module'
import { EthersModule } from '@/libs/ethers/ethers.module'
import { validationSchema } from '@/common/constants/env.constants'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: validationSchema }),
    GlobalModule,
    AuthModule,
    LogActivityModule,
    UserModule,
    EthersModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class AppModule {}
