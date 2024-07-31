import { SetMetadata } from '@nestjs/common';
import { Activity } from '@prisma/client';

export const LOG_ACTION_KEY = 'logAction';
export const LogActivity = (activity: Activity) =>
  SetMetadata(LOG_ACTION_KEY, activity);
