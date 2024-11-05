import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from '@/apps/auth/auth.service'
import { AuthController } from '@/apps/auth/auth.controller'
import { JwtStrategy } from '@/apps/auth/strategies/jwt.strategy'
import { LocalStrategy } from '@/apps/auth/strategies/local.strategy'
import { PassportModule } from '@nestjs/passport'
import { LogActivityModule } from '../log-activity/log-activity.module'

@Module({
  imports: [
    PassportModule,
    LogActivityModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
