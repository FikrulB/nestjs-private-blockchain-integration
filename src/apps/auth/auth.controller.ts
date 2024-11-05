import {
  Controller,
  UseGuards,
  Request,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { AuthLoginDto } from '@/apps/auth/dto/login.dto'
import { RegisterDto } from '@/apps/auth/dto/register.dto'
import { UpdateProfileDto } from '@/apps/auth/dto/update-profile.dto'
import { AuthService } from '@/apps/auth/auth.service'
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard'
import { LocalAuthGuard } from '@/apps/auth/guards/local-auth.guard'
import { LogActivity } from '@/common/decorators/log-activity.decorator'
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor'

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: AuthLoginDto })
  @Post('login')
  async login(@Body() input: AuthLoginDto, @Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }

  @Post('register')
  register(@Body() input: RegisterDto) {
    return this.authService.register(input)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      const userId = req.user.id
      await this.authService.updateProfile(userId, updateProfileDto)
      return { message: 'Profile updated successfully' }
    } catch (error) {
      // Handle error and return appropriate response
      throw new Error('Failed to update profile')
    }
  }
}
