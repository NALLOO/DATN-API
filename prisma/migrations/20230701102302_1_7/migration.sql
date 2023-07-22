-- DropForeignKey
ALTER TABLE "Bus" DROP CONSTRAINT "Bus_typeId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- AddForeignKey
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "BusType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
