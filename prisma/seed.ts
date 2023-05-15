import { PrismaClient } from '@prisma/client';
import { BusTypeData } from './BusType';
import { ListProvince } from './Province';

const prisma = new PrismaClient();
async function main() {
  prisma.$transaction([
    prisma.busType.deleteMany({}),
    prisma.busType.createMany({
      data: BusTypeData,
    }),
    prisma.province.deleteMany({}),
    prisma.province.createMany({
      data: ListProvince,
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
