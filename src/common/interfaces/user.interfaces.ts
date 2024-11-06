import { Users } from "@prisma/client";

export type UserInfo = Omit<Users, "password" | "createdBy" | "createdAt" | "updatedBy" | "updatedAt" | "deletedBy" | "deletedAt">