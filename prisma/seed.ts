import { PrismaClient } from '@prisma/client';
import { ListProvince } from './Province';

const prisma = new PrismaClient();
async function main() {
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
        password: '123456',
        role: 1
      }
    })
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
