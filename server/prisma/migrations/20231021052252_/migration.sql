/*
  Warnings:

  - You are about to drop the column `timezone` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `CalendarProduct` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `CalendarSetting` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `timeZone` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "timezone",
ADD COLUMN     "timeZone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CalendarProduct" DROP COLUMN "timezone",
ADD COLUMN     "timeZone" TEXT;

-- AlterTable
ALTER TABLE "CalendarSetting" DROP COLUMN "timezone",
ADD COLUMN     "timeZone" TEXT;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "timezone",
ADD COLUMN     "timeZone" TEXT;
