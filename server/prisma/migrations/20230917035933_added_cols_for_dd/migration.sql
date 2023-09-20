/*
  Warnings:

  - Added the required column `shortDescription` to the `DigitalProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `DigitalProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DigitalProduct" ADD COLUMN     "shortDescription" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL;
