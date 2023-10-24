/*
  Warnings:

  - The `description` column on the `DigitalProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DigitalProduct" ADD COLUMN     "currency" TEXT[],
ADD COLUMN     "externalFile" BOOLEAN,
ADD COLUMN     "file" TEXT,
ADD COLUMN     "flexPrice" BOOLEAN,
ADD COLUMN     "minPrice" TEXT,
ADD COLUMN     "recPrice" TEXT,
ADD COLUMN     "urls" JSONB[],
ADD COLUMN     "visibility" BOOLEAN,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB;
