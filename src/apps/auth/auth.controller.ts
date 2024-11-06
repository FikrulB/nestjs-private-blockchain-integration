import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { AuthService } from '@/apps/auth/auth.service'
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor'
import { LoginDto } from '@/apps/auth/dto/login.dto'
import { JwtRefreshAuthGuard } from '@/apps/auth/guards/jwt-refresh-auth.guard'
import { CustomRequest } from '@/common/interfaces/request.interface'
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard'

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body.email, body.password)
  }
  
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@Req() req: CustomRequest) {
    return await this.authService.refreshToken(req.user)
  }
  
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: CustomRequest) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    return await this.authService.logout(token)
  }
}
