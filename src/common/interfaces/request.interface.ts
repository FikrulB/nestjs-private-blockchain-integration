import { Request } from 'express';
import { UserInfo } from '@/common/interfaces/user.interfaces';

export interface CustomRequest extends Request {
  user?: UserInfo;
}