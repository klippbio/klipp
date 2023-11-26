/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `CalendarProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CalendarProduct" ALTER COLUMN "price" SET DEFAULT '0',
ALTER COLUMN "flexPrice" SET DEFAULT false,
ALTER COLUMN "minPrice" SET DEFAULT '0',
ALTER COLUMN "recPrice" SET DEFAULT '0';

-- CreateIndex
CREATE UNIQUE INDEX "CalendarProduct_slug_key" ON "CalendarProduct"("slug");
