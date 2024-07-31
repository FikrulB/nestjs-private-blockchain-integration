import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, code: string, status: HttpStatus) {
    super({ message, code, status }, status);
  }
}
