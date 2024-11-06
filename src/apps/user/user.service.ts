import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@/libs/prisma/prisma.service'
import { CustomException } from '@/common/exceptions/custom.exceptions'
import { UserInfo } from '@/common/interfaces/user.interfaces'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(userID: string): Promise<UserInfo> {
    const user = await this.prisma.users.findUnique({
      where: { id: userID },
    })

    if (!user) {
      throw new CustomException(
        `User with ID ${userID} not found`,
        HttpStatus.NOT_FOUND,
      )
    }

    return user
  }
}
