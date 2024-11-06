import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '@/libs/prisma/prisma.service'
import { CustomException } from '@/common/exceptions/custom.exceptions'
import { UserInfo } from '@/common/interfaces/user.interfaces'
import { AuthService } from '@/apps/auth/auth.service'
import { ERROR_MESSAGES } from '@/common/constants/error-messages'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
  ) {}

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

    const { password, ...result} = user
    return result
  }

  async getByEmail(email: string, pwd: string): Promise<UserInfo> {
    try {
      const user = await this.prisma.users.findFirst({
        where: { email: email },
      })
      
      // User does not exist
      if (!user) throw new CustomException(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      )
      
      await this.authService.comparePassword(pwd, user.password)
      return await this.authService.validateUser(user)
    } catch (error) {
      throw new CustomException(
        error.message || "An unknown error occurred",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
  
  async getByUserID(userID: string): Promise<UserInfo> {
    try {
      const user = await this.prisma.users.findFirstOrThrow({
        where: { id: userID },
      })
      
      // User does not exist
      if (!user) throw new CustomException(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      )

      // User does not exist
      if (!user) throw new CustomException(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      )

      return await this.authService.validateUser(user)
    } catch (error) {
      throw new CustomException(
        error.message || "An unknown error occurred",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
