import { NestFactory } from '@nestjs/core'
import { HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationError } from 'class-validator'
import { AppModule } from '@/app.module'
import { CustomExceptionFilter } from '@/common/filters/custom-exception.filter'
import { config } from "dotenv"
import { ConfigService } from '@nestjs/config'
config()

function validationExceptionFactory(validationErrors: ValidationError[] = []) {
  const errors = validationErrors.reduce((acc, error) => {
    const field = error.property;
    const constraints = error.constraints;

    acc[field] = Object.values(constraints);
    return acc;
  }, {});

  return new UnprocessableEntityException({
    code: HttpStatus.UNPROCESSABLE_ENTITY,
    message: errors,
  });
}

async function bootstrap() {
  const configService = new ConfigService()

  const app = await NestFactory.create(AppModule)
  
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  )

  app.useGlobalFilters(new CustomExceptionFilter())

  const configSwagger = new DocumentBuilder()
    .setTitle('Boilerplate-v1 API')
    .setDescription('Boilerplate-v1 API description')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, configSwagger)
  SwaggerModule.setup('api', app, document)

  await app.listen(configService.get("APP_PORT"))
}
bootstrap()
