-- DropForeignKey
ALTER TABLE "GoogleCalendar" DROP CONSTRAINT "GoogleCalendar_calendarSettingId_fkey";

-- AddForeignKey
ALTER TABLE "GoogleCalendar" ADD CONSTRAINT "GoogleCalendar_calendarSettingId_fkey" FOREIGN KEY ("calendarSettingId") REFERENCES "CalendarSetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
