import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const userId = request.user?.id // Assuming you have user information in the request
    const userAgent = request.headers['user-agent']

    return next.handle().pipe(
      tap(() => {
        // if (userId) {
        //   this.logActivityService.logActivity(userId, action, userAgent)
        // }
      }),
    )
  }
}
