/*
  Warnings:

  - A unique constraint covering the columns `[storeUrl,date]` on the table `Analytics` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Analytics" DROP CONSTRAINT "Analytics_storeUrl_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_storeUrl_date_key" ON "Analytics"("storeUrl", "date");
