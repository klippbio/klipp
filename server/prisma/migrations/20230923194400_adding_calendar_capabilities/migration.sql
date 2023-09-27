/*
  Warnings:

  - The values [LINK,DIGITALPRODUCT,SOCIALSET,CALENDER,WEBINAR,COURSE] on the enum `StoreItemType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `createdBy` to the `DigitalProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `DigitalProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `DigitalProduct` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('unlimited', 'rolling', 'range');

-- AlterEnum
BEGIN;
CREATE TYPE "StoreItemType_new" AS ENUM ('link', 'digitalproduct', 'socialset', 'calender', 'webinar', 'course');
ALTER TABLE "StoreItem" ALTER COLUMN "itemType" TYPE "StoreItemType_new" USING ("itemType"::text::"StoreItemType_new");
ALTER TYPE "StoreItemType" RENAME TO "StoreItemType_old";
ALTER TYPE "StoreItemType_new" RENAME TO "StoreItemType";
DROP TYPE "StoreItemType_old";
COMMIT;

-- AlterTable
ALTER TABLE "DigitalProduct" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "shortDescription" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "timeZone" TEXT;

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeZone" TEXT,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" SERIAL NOT NULL,
    "calendarProductId" INTEGER,
    "days" INTEGER[],
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "date" DATE,
    "scheduleId" INTEGER,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendarProduct" (
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
    "storeItemId" TEXT NOT NULL,
    "price" INTEGER,

    CONSTRAINT "calendarProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleCalendar" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "calendarId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "GoogleCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,
    "calendarProductId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "googleCalendarId" INTEGER,
    "meetingUrl" TEXT,
    "meetingPassword" TEXT,
    "meetingId" TEXT,
    "rescheduled" BOOLEAN DEFAULT false,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "bookingId" INTEGER,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Schedule_storeId_idx" ON "Schedule"("storeId");

-- CreateIndex
CREATE INDEX "Availability_calendarProductId_idx" ON "Availability"("calendarProductId");

-- CreateIndex
CREATE INDEX "Availability_scheduleId_idx" ON "Availability"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "calendarProduct_scheduleId_key" ON "calendarProduct"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "calendarProduct_storeItemId_key" ON "calendarProduct"("storeItemId");

-- CreateIndex
CREATE INDEX "calendarProduct_storeItemId_idx" ON "calendarProduct"("storeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "calendarProduct_storeItemId_slug_key" ON "calendarProduct"("storeItemId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleCalendar_calendarId_key" ON "GoogleCalendar"("calendarId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleCalendar_storeId_key" ON "GoogleCalendar"("storeId");

-- CreateIndex
CREATE INDEX "GoogleCalendar_storeId_idx" ON "GoogleCalendar"("storeId");

-- CreateIndex
CREATE INDEX "GoogleCalendar_calendarId_idx" ON "GoogleCalendar"("calendarId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_storeId_key" ON "Booking"("storeId");

-- CreateIndex
CREATE INDEX "Booking_calendarProductId_idx" ON "Booking"("calendarProductId");

-- CreateIndex
CREATE INDEX "Booking_googleCalendarId_idx" ON "Booking"("googleCalendarId");

-- CreateIndex
CREATE INDEX "Booking_storeId_idx" ON "Booking"("storeId");

-- CreateIndex
CREATE INDEX "Attendee_email_idx" ON "Attendee"("email");

-- CreateIndex
CREATE INDEX "Attendee_bookingId_idx" ON "Attendee"("bookingId");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_calendarProductId_fkey" FOREIGN KEY ("calendarProductId") REFERENCES "calendarProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendarProduct" ADD CONSTRAINT "calendarProduct_id_fkey" FOREIGN KEY ("id") REFERENCES "GoogleCalendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendarProduct" ADD CONSTRAINT "calendarProduct_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendarProduct" ADD CONSTRAINT "calendarProduct_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleCalendar" ADD CONSTRAINT "GoogleCalendar_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_calendarProductId_fkey" FOREIGN KEY ("calendarProductId") REFERENCES "calendarProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_googleCalendarId_fkey" FOREIGN KEY ("googleCalendarId") REFERENCES "GoogleCalendar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
