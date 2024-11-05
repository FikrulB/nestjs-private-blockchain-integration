import { SetMetadata } from '@nestjs/common'
import { Roles } from '@prisma/client'

export const RolesDecorator = (...roles: Roles[]) => SetMetadata('roles', roles)
