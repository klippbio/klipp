/*
  Warnings:

  - A unique constraint covering the columns `[saleId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "saleId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_saleId_key" ON "Booking"("saleId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;
