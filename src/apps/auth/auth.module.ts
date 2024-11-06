import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from '@/apps/auth/auth.service'
import { AuthController } from '@/apps/auth/auth.controller'
import { JwtStrategy } from '@/apps/auth/strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { JwtRefreshStrategy } from '@/apps/auth/strategies/refresh-jwt.strategy'
import { UserModule } from '@/apps/user/user.module'

@Module({
  imports: [
    PassportModule,
    JwtModule,
    forwardRef(() => UserModule),
  ],
  providers: [ConfigService, AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
