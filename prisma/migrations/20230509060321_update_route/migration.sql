/*
  Warnings:

  - You are about to drop the column `routeEndId` on the `RouteMapLocation` table. All the data in the column will be lost.
  - You are about to drop the column `routeStartId` on the `RouteMapLocation` table. All the data in the column will be lost.
  - Added the required column `routeId` to the `RouteMapLocation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RouteMapLocation" DROP CONSTRAINT "RouteMapLocation_routeEndId_fkey";

-- DropForeignKey
ALTER TABLE "RouteMapLocation" DROP CONSTRAINT "RouteMapLocation_routeStartId_fkey";

-- AlterTable
ALTER TABLE "RouteMapLocation" DROP COLUMN "routeEndId",
DROP COLUMN "routeStartId",
ADD COLUMN     "routeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "RouteMapLocation" ADD CONSTRAINT "RouteMapLocation_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
