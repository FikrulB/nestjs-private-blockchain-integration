import { PrismaClient, Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../../src/common/utils/hash.utils';

const prisma = new PrismaClient();

export const seedUsers = async () => {
  console.info('Seeding users...');

  // Create some users
  await prisma.user.createMany({
    data: [{
      id: uuidv4(),
      name: 'Super User',
      email: 'superuser@mail.me',
      password: await hashPassword('password'),
      role: Role.SUPERADMIN,
      emailVerifiedAt: new Date(),
    }, {
      id: uuidv4(),
      name: 'Admin',
      email: 'admin@mail.me',
      password: await hashPassword('password'),
      role: Role.ADMIN,
      emailVerifiedAt: new Date(),
    }, {
      id: uuidv4(),
      name: 'User',
      email: 'user@mail.me',
      password: await hashPassword('password'),
      role: Role.USER,
      emailVerifiedAt: new Date(),
    }],
  });
};
