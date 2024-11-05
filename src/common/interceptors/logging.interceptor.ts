import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Activity } from '@prisma/client'
import { LOG_ACTION_KEY } from '@/common/decorators/log-activity.decorator'
import { LogActivityService } from '@/apps/log-activity/log-activity.service'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logActivityService: LogActivityService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.get<Activity>(
      LOG_ACTION_KEY,
      context.getHandler(),
    )
    if (!action) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest()
    const userId = request.user?.id // Assuming you have user information in the request
    const userAgent = request.headers['user-agent']

    return next.handle().pipe(
      tap(() => {
        if (userId) {
          this.logActivityService.logActivity(userId, action, userAgent)
        }
      }),
    )
  }
}
