import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from '@/global.module';
import { AuthModule } from '@/apps/auth/auth.module';
import { LogActivityModule } from './apps/log-activity/log-activity.module';
import { UserController } from './apps/user/user.controller';
import { UserService } from './apps/user/user.service';
import { UserModule } from './apps/user/user.module';
import { EthersModule } from './apps/ethers/ethers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
