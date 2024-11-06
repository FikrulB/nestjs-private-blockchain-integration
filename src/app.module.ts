import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GlobalModule } from '@/global.module'
import { AuthModule } from '@/apps/auth/auth.module'
import { UserModule } from '@/apps/user/user.module'
import { validationSchema } from '@/common/constants/env.constants'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: validationSchema }),
    GlobalModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
