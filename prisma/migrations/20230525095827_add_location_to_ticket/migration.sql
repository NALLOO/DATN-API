-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "startLocationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_startLocationId_fkey" FOREIGN KEY ("startLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
