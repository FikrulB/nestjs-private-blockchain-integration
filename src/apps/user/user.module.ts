import { forwardRef, Module } from '@nestjs/common'
import { UserService } from '@/apps/user/user.service'
import { UserController } from '@/apps/user/user.controller'
import { AuthModule } from '@/apps/auth/auth.module'

@Module({
  imports: [forwardRef(() =>AuthModule)],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
