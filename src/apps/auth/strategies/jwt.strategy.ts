import { ExtractJwt, Strategy } from 'passport-jwt'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { CustomException } from '@/common/exceptions/custom.exceptions'
import { ERROR_MESSAGES } from '@/common/constants/error-messages'
import { UserInfo } from '@/common/interfaces/user.interfaces'
import { JwtPayload } from '@/common/interfaces/auth.interface'
import { UserService } from '@/apps/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly userService: UserService,
    config: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET_KEY')
    })
  }
  
  async validate(payload: JwtPayload): Promise<UserInfo | null> {
    const authUser = await this.userService.getByUserID(payload.id)
    if (!authUser) {
      throw new CustomException(
        ERROR_MESSAGES.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      )
    }
    
    return authUser
  }
}