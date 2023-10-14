/*
  Warnings:

  - You are about to drop the column `storeId` on the `GoogleCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `defaultScheduleId` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the `calendarProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_calendarProductId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_calendarProductId_fkey";

-- DropForeignKey
ALTER TABLE "GoogleCalendar" DROP CONSTRAINT "GoogleCalendar_storeId_fkey";

-- DropForeignKey
ALTER TABLE "calendarProduct" DROP CONSTRAINT "calendarProduct_id_fkey";

-- DropForeignKey
ALTER TABLE "calendarProduct" DROP CONSTRAINT "calendarProduct_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "calendarProduct" DROP CONSTRAINT "calendarProduct_storeItemId_fkey";

-- DropIndex
DROP INDEX "GoogleCalendar_storeId_idx";

-- DropIndex
DROP INDEX "GoogleCalendar_storeId_key";

-- AlterTable
ALTER TABLE "GoogleCalendar" DROP COLUMN "storeId";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "defaultScheduleId",
DROP COLUMN "timeZone";

-- DropTable
DROP TABLE "calendarProduct";

-- CreateTable
CREATE TABLE "CalendarProduct" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "length" INTEGER NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "timeZone" TEXT,
    "periodType" "PeriodType" NOT NULL DEFAULT 'unlimited',
    "periodStartDate" TIMESTAMP(3),
    "periodEndDate" TIMESTAMP(3),
    "minimumBookingNotice" INTEGER NOT NULL DEFAULT 120,
    "beforeEventBuffer" INTEGER NOT NULL DEFAULT 0,
    "afterEventBuffer" INTEGER NOT NULL DEFAULT 0,
    "scheduleId" INTEGER,
    "calendarSettingId" INTEGER NOT NULL,
    "storeItemId" TEXT NOT NULL,
    "price" INTEGER,

    CONSTRAINT "CalendarProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarSetting" (
    "id" SERIAL NOT NULL,
    "minimumBookingNotice" INTEGER NOT NULL DEFAULT 120,
    "beforeEventBuffer" INTEGER NOT NULL DEFAULT 0,
    "afterEventBuffer" INTEGER NOT NULL DEFAULT 0,
    "timeZone" TEXT,
    "defaultScheduleId" INTEGER,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "CalendarSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalendarProduct_scheduleId_key" ON "CalendarProduct"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarProduct_calendarSettingId_key" ON "CalendarProduct"("calendarSettingId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarProduct_storeItemId_key" ON "CalendarProduct"("storeItemId");

-- CreateIndex
CREATE INDEX "CalendarProduct_storeItemId_idx" ON "CalendarProduct"("storeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarProduct_storeItemId_slug_key" ON "CalendarProduct"("storeItemId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarSetting_storeId_key" ON "CalendarSetting"("storeId");

-- CreateIndex
CREATE INDEX "CalendarSetting_storeId_idx" ON "CalendarSetting"("storeId");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_calendarProductId_fkey" FOREIGN KEY ("calendarProductId") REFERENCES "CalendarProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarProduct" ADD CONSTRAINT "CalendarProduct_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarProduct" ADD CONSTRAINT "CalendarProduct_calendarSettingId_fkey" FOREIGN KEY ("calendarSettingId") REFERENCES "CalendarSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarProduct" ADD CONSTRAINT "CalendarProduct_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarSetting" ADD CONSTRAINT "CalendarSetting_id_fkey" FOREIGN KEY ("id") REFERENCES "GoogleCalendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarSetting" ADD CONSTRAINT "CalendarSetting_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_calendarProductId_fkey" FOREIGN KEY ("calendarProductId") REFERENCES "CalendarProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
