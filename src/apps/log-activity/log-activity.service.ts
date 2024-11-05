import { PrismaService } from '@/libs/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Activities } from '@prisma/client'
import { LogActivityQueryDto } from './dto/log-activity-query.dto'

@Injectable()
export class LogActivityService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: LogActivityQueryDto) {
    const { page = 1, limit = 10 } = query
    return this.prisma.logActivities.paginate().withPages({
      page,
      limit,
    })
  }

  async logActivity(userId: string, activity: Activities, userAgent?: string) {
    await this.prisma.logActivities.create({
      data: {
        userAgent,
        userId,
        activity,
      },
    })
  }
}
