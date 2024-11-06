import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard'
import { UserService } from './user.service'
import { RolesGuard } from '@/common/guards/roles.guard'
import { Roles } from '@prisma/client'
import { RolesDecorator } from '@/common/decorators/roles.decorator'
import { CustomRequest } from '@/common/interfaces/request.interface'

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('User')
@Controller('user')
@RolesDecorator(Roles.OWNER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  me(@Req() req: CustomRequest) {
    return this.userService.findOne(req.user.id)
  }
}
