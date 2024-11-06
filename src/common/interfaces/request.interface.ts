import { Users } from '@prisma/client';
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: Users;
}