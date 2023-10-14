/*
  Warnings:

  - You are about to drop the column `calendarId` on the `GoogleCalendar` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[calendarSettingId]` on the table `GoogleCalendar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `calendarSettingId` to the `GoogleCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CalendarSetting" DROP CONSTRAINT "CalendarSetting_id_fkey";

-- DropIndex
DROP INDEX "GoogleCalendar_calendarId_idx";

-- DropIndex
DROP INDEX "GoogleCalendar_calendarId_key";

-- AlterTable
ALTER TABLE "GoogleCalendar" DROP COLUMN "calendarId",
ADD COLUMN     "calendarSettingId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GoogleCalendar_calendarSettingId_key" ON "GoogleCalendar"("calendarSettingId");

-- CreateIndex
CREATE INDEX "GoogleCalendar_id_idx" ON "GoogleCalendar"("id");

-- AddForeignKey
ALTER TABLE "GoogleCalendar" ADD CONSTRAINT "GoogleCalendar_calendarSettingId_fkey" FOREIGN KEY ("calendarSettingId") REFERENCES "CalendarSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
