import * as bcrypt from 'bcryptjs'
import * as moment from 'moment';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { PrismaService } from '@/libs/prisma/prisma.service'
import { CustomException } from '@/common/exceptions/custom.exceptions'
import { ERROR_MESSAGES } from '@/common/constants/error-messages'
import { UserInfo } from '@/common/interfaces/user.interfaces'
import { AuthTokens } from '@/common/interfaces/auth.interface'
import { ConfigService } from '@nestjs/config'
import { separateDuration } from '@/common/utils/time.utils'
import { Users } from '@prisma/client';
import { UserService } from '@/apps/user/user.service';

@Injectable()
export class AuthService {
  private readonly configurationJwt: JwtSignOptions
  private readonly configurationJwtRefresh: JwtSignOptions
  
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) {
    this.configurationJwt = {
      secret: this.config.get('JWT_SECRET_KEY'),
      expiresIn: this.config.get('JWT_EXPIRED_DURATION'),
    }
    
    this.configurationJwtRefresh = {
      secret: this.config.get('JWT_REFRESH_SECRET_KEY'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRED_DURATION'),
    }
  }
  
  private async generateTokens(payload: UserInfo): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.signAsync(payload, this.configurationJwt),
      this.jwtService.signAsync(payload, this.configurationJwtRefresh),
    ]);
  }
  
  private async calculateExpirationDate(duration: string): Promise<Date> {
    const { amount, unit } = await separateDuration(duration);
    const unitMapping = {
      s: "seconds",
      m: "minutes",
      h: "hours",
      d: "days",
    };
    
    return moment().add(amount, unitMapping[unit]).toDate();
  }
  
  async validateUser(user: Users): Promise<UserInfo> {
    try {
      // Email has not been verified
      if (!user.emailVerifiedAt) throw new CustomException(
        ERROR_MESSAGES.EMAIL_NOT_VERIFIED,
        HttpStatus.FORBIDDEN,
      )
      
      // User status is inactive
      if (!user.status) throw new CustomException(
        ERROR_MESSAGES.USER_INACTIVE,
        HttpStatus.FORBIDDEN,
      )
      
      // User has been deleted
      if (user.deletedAt) throw new CustomException(
        ERROR_MESSAGES.USER_DELETED,
        HttpStatus.FORBIDDEN,
      )
      
      const { password, createdAt, createdBy, updatedBy, updatedAt, deletedBy, deletedAt, ...result } = user
      return result
    } catch (error) {
      throw new CustomException(
        error.message || "An unknown error occurred",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
  
  async comparePassword(password: string, passwordHash: string): Promise<boolean> {
    try {
      const passwordMatches = await bcrypt.compare(password, passwordHash)
      
      // Wrong password
      if (!passwordMatches) {
        throw new CustomException(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HttpStatus.UNAUTHORIZED,
        )
      }
      
      return true
    } catch (error) {
      throw new CustomException(
        error.message || "An unknown error occurred",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
  
  async generateToken(payload: UserInfo): Promise<AuthTokens> {
    try {
      const [accessToken, refreshToken] = await this.generateTokens(payload);
  
      const expiresAccessAt = await this.calculateExpirationDate(this.config.get('JWT_EXPIRED_DURATION'));
      const expiresRefreshAt = await this.calculateExpirationDate(this.config.get('JWT_REFRESH_EXPIRED_DURATION'));

      await this.prisma.sessionTokens.create({
        data: {
          createdBy: payload.id,
          accessToken,
          refreshToken,
          expiresAccessAt,
          expiresRefreshAt,
        }
      })
      
      return { accessToken, refreshToken }
    } catch (error) {
      throw new CustomException(
        error.message || "An unknown error occurred",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
  
  async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.getByEmail(email, password)
      const tokens = await this.generateToken(user)
      
      return { user, tokens }
    } catch (error) {
      throw new CustomException(
        error.message || "An unknown error occurred",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
  
  async refreshToken(user: UserInfo): Promise<any> {
    try {
      const tokens = await this.generateToken(user)
      
      return { user, tokens }
    } catch (error) {
      throw new CustomException(
        error.message || "An unknown error occurred",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
  
  async logout(token: string): Promise<any> {
    try {
      const tokens = await this.prisma.sessionTokens.update({
        where: { accessToken: token },
        data: { isRevoked: true }
      })
      
      return tokens
    } catch (error) {
      throw new CustomException(
        error.message || "An unknown error occurred",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
