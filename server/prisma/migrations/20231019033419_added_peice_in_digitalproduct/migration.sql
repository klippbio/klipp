/*
  Warnings:

  - Added the required column `price` to the `DigitalProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DigitalProduct" ADD COLUMN     "price" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "createdBy" DROP NOT NULL,
ALTER COLUMN "shortDescription" DROP NOT NULL,
ALTER COLUMN "thumbnailUrl" DROP NOT NULL;
