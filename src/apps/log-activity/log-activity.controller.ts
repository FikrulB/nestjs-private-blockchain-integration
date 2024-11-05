import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { LogActivityService } from './log-activity.service'
import { LogActivityQueryDto } from './dto/log-activity-query.dto'
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard'
import { RolesGuard } from '@/common/guards/roles.guard'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/common/decorators/roles.decorator'
import { Role } from '@prisma/client'

@ApiTags('Log Activity')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('log-activity')
@Roles(Role.SUPERADMIN)
export class LogActivityController {
  constructor(private readonly logActivityService: LogActivityService) {}

  @Get()
  async findAll(@Query() query: LogActivityQueryDto) {
    try {
      const [data, meta] = await this.logActivityService.findAll(query)
      return {
        data,
        meta,
      }
    } catch (error) {
      throw error
    }
  }
}
