/*
  Warnings:

  - Added the required column `listTicket` to the `BusType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusType" ADD COLUMN     "listTicket" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trip" ALTER COLUMN "emptyTicket" SET NOT NULL,
ALTER COLUMN "emptyTicket" SET DATA TYPE TEXT;
