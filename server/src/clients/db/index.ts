import { PrismaClient } from '@prisma/client';

declare global {
  // Ensures that `prismaClient` is attached to the `global` object only in development
  var prismaClient: PrismaClient | undefined;
}

export const prismaClient =
  global.prismaClient ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prismaClient = prismaClient;
