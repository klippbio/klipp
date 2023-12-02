/*
  Warnings:

  - You are about to drop the column `slug` on the `CalendarProduct` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CalendarProduct_slug_key";

-- DropIndex
DROP INDEX "CalendarProduct_storeItemId_slug_key";

-- AlterTable
ALTER TABLE "CalendarProduct" DROP COLUMN "slug";
