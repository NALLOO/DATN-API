/*
  Warnings:

  - Added the required column `image` to the `BusType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusType" ADD COLUMN     "image" TEXT NOT NULL;
