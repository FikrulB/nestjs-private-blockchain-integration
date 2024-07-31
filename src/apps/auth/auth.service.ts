import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@/libs/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { hashPassword } from '@/common/utils/hash.utils';
import { CustomException } from '@/common/exceptions/custom.exceptions';
import { ERROR_CODES, ERROR_MESSAGES } from '@/common/constants/error-messages';
import { RegisterDto } from '@/apps/auth/dto/register.dto';
import { UpdateProfileDto } from '@/apps/auth/dto/update-profile.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: username },
      });

      if (!user) {
        throw new CustomException(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          ERROR_CODES.INVALID_CREDENTIALS,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const passwordMatches = await bcrypt.compare(pass, user.password);
      if (!passwordMatches) {
        throw new CustomException(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          ERROR_CODES.INVALID_CREDENTIALS,
          HttpStatus.UNAUTHORIZED,
        );
      }

      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async login(user: User): Promise<any> {
    try {
      const payload = {
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload);
      const { password, ...result } = user;

      return {
        user: result,
        accessToken,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getProfile(userId: string) {
    return this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const { name, email, password } = registerDto;
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new CustomException(
        ERROR_MESSAGES.EMAIL_EXISTS,
        ERROR_CODES.EMAIL_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.USER,
        emailVerifiedAt: new Date(),
      },
    });

    const { password: _, ...result } = user;

    // Generate a JWT token
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    // Return the user information and access token
    return { user: result, accessToken };
  }

  async updateProfile(userId: string, input: UpdateProfileDto) {
    try {
      const { name, phone, address } = input;

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          name,
          phone,
          address,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
