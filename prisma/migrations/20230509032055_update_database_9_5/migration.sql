/*
  Warnings:

  - You are about to drop the column `endLocation` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `startLocation` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `routeId` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "endLocation",
DROP COLUMN "startLocation",
ADD COLUMN     "routeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Province" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "startProvinceId" INTEGER NOT NULL,
    "endProvinceId" INTEGER NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteMapLocation" (
    "id" SERIAL NOT NULL,
    "routeEndId" INTEGER NOT NULL,
    "routeStartId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,

    CONSTRAINT "RouteMapLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_startProvinceId_fkey" FOREIGN KEY ("startProvinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_endProvinceId_fkey" FOREIGN KEY ("endProvinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteMapLocation" ADD CONSTRAINT "RouteMapLocation_routeEndId_fkey" FOREIGN KEY ("routeEndId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteMapLocation" ADD CONSTRAINT "RouteMapLocation_routeStartId_fkey" FOREIGN KEY ("routeStartId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteMapLocation" ADD CONSTRAINT "RouteMapLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
