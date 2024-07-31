import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/libs/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { hashPassword } from '@/common/utils/hash.utils';
import { CustomException } from '@/common/exceptions/custom.exceptions';
import { ERROR_CODES } from '@/common/constants/error-messages';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { passwordConfirm: _, ...payload } = createUserDto;

    payload.password = await hashPassword(payload.password);
    return this.prisma.user.create({
      data: payload,
    });
  }

  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 10 } = query;
    return this.prisma.user.paginate().withPages({
      page,
      limit,
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new CustomException(
        `User with ID ${id} not found`,
        ERROR_CODES.DATA_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new CustomException(
        `User with ID ${id} not found`,
        ERROR_CODES.DATA_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new CustomException(
        `User with ID ${id} not found`,
        ERROR_CODES.DATA_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
