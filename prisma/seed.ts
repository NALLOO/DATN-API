import { PrismaClient } from '@prisma/client';
import { BusTypeData } from './BusType';

const prisma = new PrismaClient();
async function main() {
  prisma.$transaction([
    prisma.busType.deleteMany({}),
    prisma.busType.createMany({
      data: BusTypeData,
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
