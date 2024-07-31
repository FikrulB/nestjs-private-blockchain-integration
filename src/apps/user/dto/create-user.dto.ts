// create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { UserStatus, Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '@/apps/auth/decorators/match.decorator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
  })
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Match('password')
  passwordConfirm: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  status?: UserStatus;

  @ApiProperty()
  @IsNotEmpty()
  role: Role;
}