/*
  Warnings:

  - Added the required column `calendarSettingId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "calendarSettingId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_calendarSettingId_fkey" FOREIGN KEY ("calendarSettingId") REFERENCES "CalendarSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
