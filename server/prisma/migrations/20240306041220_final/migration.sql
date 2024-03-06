-- CreateEnum
CREATE TYPE "StoreItemType" AS ENUM ('link', 'digitalproduct', 'socialset', 'calendar', 'webinar', 'course');

-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('unlimited', 'rolling', 'range');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'REFUNDPENDING');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('SCHEDULED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "storeDescription" TEXT,
    "storeTitle" TEXT NOT NULL,
    "storeUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "instagram" TEXT,
    "tiktok" TEXT,
    "youtube" TEXT,
    "twitter" TEXT,
    "color" TEXT DEFAULT '#E9976A',

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "storeId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreItem" (
    "id" SERIAL NOT NULL,
    "itemOrder" SERIAL NOT NULL,
    "storeId" TEXT NOT NULL,
    "itemType" "StoreItemType" NOT NULL,

    CONSTRAINT "StoreItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "storeItemId" INTEGER NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalProduct" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" TEXT,
    "price" TEXT,
    "recPrice" TEXT,
    "minPrice" TEXT,
    "description" JSONB,
    "currency" TEXT[] DEFAULT ARRAY['USD']::TEXT[],
    "storeItemId" INTEGER NOT NULL,
    "shortDescription" TEXT,
    "flexPrice" BOOLEAN,
    "externalFile" BOOLEAN,
    "visibility" BOOLEAN,
    "urls" JSONB,
    "thumbnailUrl" TEXT,
    "createdBy" TEXT,

    CONSTRAINT "DigitalProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DDFile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "digitalProductId" INTEGER NOT NULL,

    CONSTRAINT "DDFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialSet" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "instagram" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "twitter" TEXT NOT NULL,
    "youtube" TEXT NOT NULL,
    "twitch" TEXT NOT NULL,
    "tiktok" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "SocialSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeZone" TEXT,
    "calendarSettingId" INTEGER NOT NULL,

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
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarProduct" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "shortDescription" TEXT,
    "description" JSONB,
    "length" INTEGER NOT NULL,
    "visibility" BOOLEAN NOT NULL DEFAULT false,
    "timeZone" TEXT NOT NULL,
    "price" TEXT DEFAULT '0',
    "recPrice" TEXT DEFAULT '0',
    "minPrice" TEXT DEFAULT '0',
    "flexPrice" BOOLEAN DEFAULT false,
    "currency" TEXT[] DEFAULT ARRAY['USD']::TEXT[],
    "periodType" "PeriodType" NOT NULL DEFAULT 'unlimited',
    "periodStartDate" TIMESTAMP(3),
    "periodEndDate" TIMESTAMP(3),
    "minimumBookingNotice" INTEGER NOT NULL DEFAULT 120,
    "beforeEventBuffer" INTEGER NOT NULL DEFAULT 0,
    "afterEventBuffer" INTEGER NOT NULL DEFAULT 0,
    "scheduleId" INTEGER,
    "calendarSettingId" INTEGER NOT NULL,
    "storeItemId" INTEGER NOT NULL,

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

-- CreateTable
CREATE TABLE "GoogleCalendar" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "calendarSettingId" INTEGER NOT NULL,

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
    "bookingStatus" "BookingStatus" NOT NULL,
    "meetingUrl" TEXT,
    "meetingPassword" TEXT,
    "meetingId" TEXT,
    "rescheduled" BOOLEAN DEFAULT false,
    "saleId" TEXT,
    "cancelledSaleId" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,
    "storeItemId" INTEGER NOT NULL,
    "salePrice" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerName" TEXT,
    "status" "SaleStatus" NOT NULL,
    "additionalInfo" JSONB,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "Analytics" (
    "id" SERIAL NOT NULL,
    "storeUrl" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "pageView" INTEGER NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Store_storeUrl_key" ON "Store"("storeUrl");

-- CreateIndex
CREATE INDEX "userId" ON "Store"("userId");

-- CreateIndex
CREATE INDEX "storeUrl" ON "Store"("storeUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_key" ON "Payment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_accountId_key" ON "Payment"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreItem_id_key" ON "StoreItem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Link_storeItemId_key" ON "Link"("storeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalProduct_id_key" ON "DigitalProduct"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalProduct_storeItemId_key" ON "DigitalProduct"("storeItemId");

-- CreateIndex
CREATE INDEX "DigitalProduct_storeItemId_idx" ON "DigitalProduct"("storeItemId");

-- CreateIndex
CREATE INDEX "DDFile_digitalProductId_idx" ON "DDFile"("digitalProductId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialSet_storeId_key" ON "SocialSet"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_id_key" ON "Schedule"("id");

-- CreateIndex
CREATE INDEX "Schedule_storeId_idx" ON "Schedule"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_id_key" ON "Availability"("id");

-- CreateIndex
CREATE INDEX "Availability_calendarProductId_idx" ON "Availability"("calendarProductId");

-- CreateIndex
CREATE INDEX "Availability_scheduleId_idx" ON "Availability"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarProduct_storeItemId_key" ON "CalendarProduct"("storeItemId");

-- CreateIndex
CREATE INDEX "CalendarProduct_storeItemId_idx" ON "CalendarProduct"("storeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarSetting_storeId_key" ON "CalendarSetting"("storeId");

-- CreateIndex
CREATE INDEX "CalendarSetting_storeId_idx" ON "CalendarSetting"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleCalendar_calendarSettingId_key" ON "GoogleCalendar"("calendarSettingId");

-- CreateIndex
CREATE INDEX "GoogleCalendar_id_idx" ON "GoogleCalendar"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_saleId_key" ON "Booking"("saleId");

-- CreateIndex
CREATE INDEX "Booking_calendarProductId_idx" ON "Booking"("calendarProductId");

-- CreateIndex
CREATE INDEX "Booking_googleCalendarId_idx" ON "Booking"("googleCalendarId");

-- CreateIndex
CREATE INDEX "Booking_storeId_idx" ON "Booking"("storeId");

-- CreateIndex
CREATE INDEX "Sale_storeId_idx" ON "Sale"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_email_key" ON "Attendee"("email");

-- CreateIndex
CREATE INDEX "Attendee_email_idx" ON "Attendee"("email");

-- CreateIndex
CREATE INDEX "Attendee_bookingId_idx" ON "Attendee"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_storeUrl_date_key" ON "Analytics"("storeUrl", "date");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreItem" ADD CONSTRAINT "StoreItem_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalProduct" ADD CONSTRAINT "DigitalProduct_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DDFile" ADD CONSTRAINT "DDFile_digitalProductId_fkey" FOREIGN KEY ("digitalProductId") REFERENCES "DigitalProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialSet" ADD CONSTRAINT "SocialSet_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_calendarSettingId_fkey" FOREIGN KEY ("calendarSettingId") REFERENCES "CalendarSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_calendarProductId_fkey" FOREIGN KEY ("calendarProductId") REFERENCES "CalendarProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarProduct" ADD CONSTRAINT "CalendarProduct_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarProduct" ADD CONSTRAINT "CalendarProduct_calendarSettingId_fkey" FOREIGN KEY ("calendarSettingId") REFERENCES "CalendarSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarProduct" ADD CONSTRAINT "CalendarProduct_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarSetting" ADD CONSTRAINT "CalendarSetting_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleCalendar" ADD CONSTRAINT "GoogleCalendar_calendarSettingId_fkey" FOREIGN KEY ("calendarSettingId") REFERENCES "CalendarSetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_calendarProductId_fkey" FOREIGN KEY ("calendarProductId") REFERENCES "CalendarProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_googleCalendarId_fkey" FOREIGN KEY ("googleCalendarId") REFERENCES "GoogleCalendar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
