import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { AppModule } from '@/app.module';
import { CustomExceptionFilter } from '@/common/filters/custom-exception.filter';
import { ERROR_CODES } from '@/common/constants/error-messages';

function validationExceptionFactory(validationErrors: ValidationError[] = []) {
  const errors = validationErrors.reduce((acc, error) => {
    const field = error.property;
    const constraints = error.constraints;

    acc[field] = Object.values(constraints);
    return acc;
  }, {});

  return new BadRequestException({
    statusCode: 400,
    error: 'Bad Request',
    message: errors,
    errorCode: ERROR_CODES.VALIDATON_ERROR,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  app.useGlobalFilters(new CustomExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Boilerplate-v1 API')
    .setDescription('Boilerplate-v1 API description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
