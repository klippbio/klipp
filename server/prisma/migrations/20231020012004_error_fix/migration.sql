/*
  Warnings:

  - The `description` column on the `DigitalProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `urls` column on the `DigitalProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DigitalProduct" DROP COLUMN "description",
ADD COLUMN     "description" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "urls",
ADD COLUMN     "urls" TEXT[] DEFAULT ARRAY[]::TEXT[];
