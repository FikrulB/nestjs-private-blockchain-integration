import { ERROR_CODES, ERROR_MESSAGES } from '@/common/constants/error-messages';
import { CustomException } from '@/common/exceptions/custom.exceptions';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw new CustomException(
        ERROR_MESSAGES.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
