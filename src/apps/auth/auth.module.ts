import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from '@/apps/auth/auth.service'
import { AuthController } from '@/apps/auth/auth.controller'
import { JwtStrategy } from '@/apps/auth/strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    PassportModule,
    JwtModule,
  ],
  providers: [ConfigService, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
