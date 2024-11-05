import { SetMetadata } from '@nestjs/common'
import { Activities } from '@prisma/client'

export const LOG_ACTION_KEY = 'logAction'
export const LogActivity = (activity: Activities) => SetMetadata(LOG_ACTION_KEY, activity)
