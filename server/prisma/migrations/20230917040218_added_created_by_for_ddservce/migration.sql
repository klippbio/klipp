/*
  Warnings:

  - Added the required column `createdBy` to the `DigitalProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DigitalProduct" ADD COLUMN     "createdBy" TEXT NOT NULL;
