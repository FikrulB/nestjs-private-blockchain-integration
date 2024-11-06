import { ExtractJwt, Strategy } from 'passport-jwt'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '@/apps/auth/auth.service'
import { CustomException } from '@/common/exceptions/custom.exceptions'
import { ERROR_MESSAGES } from '@/common/constants/error-messages'
import { UserInfo } from '@/common/interfaces/user.interfaces'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_REFRESH_SECRET_KEY')
    })
  }
  
  async validate(payload: any): Promise<UserInfo | null> {
    const authUser = await this.authService.getProfile(payload.sub)
    if (!authUser) {
      throw new CustomException(
        ERROR_MESSAGES.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      )
    }
    
    const { password, ...result } = authUser
    return result
  }
}
