import { ExtractJwt, Strategy } from 'passport-jwt'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '@/apps/auth/auth.service'
import { CustomException } from '@/common/exceptions/custom.exceptions'
import { ERROR_CODES, ERROR_MESSAGES } from '@/common/constants/error-messages'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: new ConfigService().get<string>('JWT_SECRET_KEY'),
    })
  }

  async validate(payload: any) {
    let user = null
    if (payload.sub) {
      user = await this.authService.getProfile(payload.sub)
    }

    if (!user) {
      throw new CustomException(
        ERROR_MESSAGES.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      )
    }

    const { password, ...result } = user
    return result
  }
}
