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
import { CustomRequest } from '@/common/interfaces/request.interface'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password)
  }
  
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('test')
  async test() {
    return
  }
}
