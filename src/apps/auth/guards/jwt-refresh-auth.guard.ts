import * as moment from 'moment';
import { ERROR_MESSAGES } from '@/common/constants/error-messages';
import { PrismaService } from '@/libs/prisma/prisma.service';
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CustomException } from '@/common/exceptions/custom.exceptions';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
  ) {super()}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return false

    const sessionToken = await this.prismaService.sessionTokens.findUnique({
      where: { refreshToken: token },
    })

    // token not found at database OR token is revoked OR expired token
    if (!sessionToken || sessionToken.isRevoked || moment().isAfter(moment(sessionToken.expiresRefreshAt))) throw new CustomException(
      ERROR_MESSAGES.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    )

    const isValid = await super.canActivate(context);
    if (!isValid) return false;
    
    return true
  }
}