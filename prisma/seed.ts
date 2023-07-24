import { PrismaClient } from '@prisma/client';
import { ListProvince } from './Province';
import * as argon from 'argon2';
const prisma = new PrismaClient();
async function main() {
  const password = await argon.hash('123456')
  prisma.$transaction([
    prisma.province.deleteMany({}),
    prisma.province.createMany({
      data: ListProvince,
    }),
    prisma.user.deleteMany({}),
    prisma.user.create({
      data: {
        name: 'ADMIN',
        phone: '079914332',
        email: 'nghiak57dl1@gmail.com',
        password: password,
        role: 1,
      },
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
