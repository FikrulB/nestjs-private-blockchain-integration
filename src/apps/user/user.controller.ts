import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard'
import { UserService } from './user.service'
import { RolesGuard } from '@/common/guards/roles.guard'
import { Roles } from '@prisma/client'
import { RolesDecorator } from '@/common/decorators/roles.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('User')
@Controller('user')
@RolesDecorator(Roles.OWNER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }
}
