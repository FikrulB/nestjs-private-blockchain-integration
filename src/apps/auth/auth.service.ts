import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '@/libs/prisma/prisma.service'
import { Roles, Users } from '@prisma/client'
import { hashPassword } from '@/common/utils/hash.utils'
import { CustomException } from '@/common/exceptions/custom.exceptions'
import { ERROR_CODES, ERROR_MESSAGES } from '@/common/constants/error-messages'
import { RegisterDto } from '@/apps/auth/dto/register.dto'
import { UpdateProfileDto } from '@/apps/auth/dto/update-profile.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.prisma.users.findFirst({
        where: { email: username },
      })

      if (!user) {
        throw new CustomException(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HttpStatus.UNAUTHORIZED,
        )
      }

      const passwordMatches = await bcrypt.compare(pass, user.password)
      if (!passwordMatches) {
        throw new CustomException(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HttpStatus.UNAUTHORIZED,
        )
      }

      return user
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async login(user: Users): Promise<any> {
    try {
      const payload = {
        sub: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      }

      const accessToken = this.jwtService.sign(payload)
      const { password, ...result } = user

      return {
        user: result,
        accessToken,
      }
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async getProfile(userId: string) {
    return this.prisma.users.findFirstOrThrow({
      where: { id: userId },
    })
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const { name, email, password } = registerDto
    const existingUserByEmail = await this.prisma.users.findUnique({
      where: { email },
    })

    if (existingUserByEmail) {
      throw new CustomException(
        ERROR_MESSAGES.EMAIL_EXISTS,
        HttpStatus.CONFLICT,
      )
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create the user
    const user = await this.prisma.users.create({
      data: {
        fullName: name,
        email,
        password: hashedPassword,
        role: Roles.USER,
        emailVerifiedAt: new Date(),
      },
    })

    const { password: _, ...result } = user

    // Generate a JWT token
    const payload = {
      sub: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
    }

    const accessToken = this.jwtService.sign(payload)

    // Return the user information and access token
    return { user: result, accessToken }
  }

  async updateProfile(userId: string, input: UpdateProfileDto) {
    try {
      const { name, phone, address } = input

      await this.prisma.users.update({
        where: { id: userId },
        data: {
          fullName: name,
          accountAddress: address,
        },
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
