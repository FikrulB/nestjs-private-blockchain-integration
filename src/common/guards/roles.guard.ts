import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ERROR_CODES, ERROR_MESSAGES } from '@/common/constants/error-messages';
import { CustomException } from '@/common/exceptions/custom.exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.some((role) => user.role === role)) {
      throw new CustomException(
        ERROR_MESSAGES.FORBIDDEN_ACCESS,
        ERROR_CODES.FORBIDDEN_ACCESS,
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
