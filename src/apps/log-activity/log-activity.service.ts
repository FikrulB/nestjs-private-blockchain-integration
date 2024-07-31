import { PrismaService } from '@/libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Activity } from '@prisma/client';
import { LogActivityQueryDto } from './dto/log-activity-query.dto';

@Injectable()
export class LogActivityService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: LogActivityQueryDto) {
    const { page = 1, limit = 10 } = query;
    return this.prisma.logActivity.paginate().withPages({
      page,
      limit,
    });
  }

  async logActivity(userId: string, activity: Activity, userAgent?: string) {
    await this.prisma.logActivity.create({
      data: {
        userAgent,
        userId,
        activity,
      },
    });
  }
}
