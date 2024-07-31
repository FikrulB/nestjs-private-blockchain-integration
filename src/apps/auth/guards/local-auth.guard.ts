import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { AuthLoginDto } from '@/apps/auth/dto/login.dto';
import { validate } from 'class-validator';
import { ERROR_CODES } from '@/common/constants/error-messages';
import { CustomException } from '@/common/exceptions/custom.exceptions';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    // transform the request object to class instance
    const body = plainToClass(AuthLoginDto, request.body);

    // get a list of errors
    const errors = await validate(body);

    // extract error messages from the errors array
    const errorMessages = errors.flatMap(({ constraints }) =>
      Object.values(constraints),
    );

    if (errorMessages.length > 0) {
      // return bad request if validation fails
      throw new CustomException(
        errorMessages[0],
        ERROR_CODES.VALIDATON_ERROR,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
