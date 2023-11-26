/*
  Warnings:

  - The `description` column on the `CalendarProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `CalendarProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CalendarProduct" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currency" TEXT[] DEFAULT ARRAY['USD']::TEXT[],
ADD COLUMN     "flexPrice" BOOLEAN,
ADD COLUMN     "minPrice" TEXT,
ADD COLUMN     "recPrice" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB,
ALTER COLUMN "price" SET DATA TYPE TEXT;
