import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string
}
