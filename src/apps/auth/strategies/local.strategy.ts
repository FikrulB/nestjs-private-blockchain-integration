import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { HttpStatus, Injectable } from '@nestjs/common'
import { AuthService } from '@/apps/auth/auth.service'
import { ERROR_CODES, ERROR_MESSAGES } from '@/common/constants/error-messages'
import { CustomException } from '@/common/exceptions/custom.exceptions'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password)
    if (!user) {
      throw new CustomException(
        ERROR_MESSAGES.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      )
    }

    return user
  }
}
