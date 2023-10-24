/*
  Warnings:

  - The `urls` column on the `DigitalProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DigitalProduct" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "currency" SET DEFAULT ARRAY['USD']::TEXT[],
DROP COLUMN "urls",
ADD COLUMN     "urls" JSONB;
