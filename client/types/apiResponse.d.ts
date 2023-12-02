export interface ScheduleApiResponse {
  id: number;
  storeId: string;
  name: string;
  timeZone?: string;
  availability?: AvailabilityApiResponse[];
  calendarSettingId: number;
  calendarSetting?: CalendarSettingApiResponse;
}

export interface AvailabilityApiResponse {
  id: number;
  calendarProductId?: number;
  days: number[];
  startTime: string; // ISO 8601 string format
  endTime: string; // ISO 8601 string format
  date?: string; // ISO 8601 string format
  schedule: ScheduleApiResponse;
  scheduleId: number;
}

export interface CalendarProductApiResponse {
  id: number;
  createdAt: string; // ISO 8601 string format
  updatedAt: string; // ISO 8601 string format
  title: string;
  thumbnailUrl?: string;
  shortDescription?: string;
  description?: string;
  length: number;
  hidden: boolean;
  bookings?: Booking[];
  availability?: AvailabilityApiResponse[];
  timeZone?: string;
  price?: string;
  recPrice?: string;
  minPrice?: string;
  flexPrice?: boolean;
  currency: string[];
  periodType: PeriodType;
  periodStartDate?: string; // ISO 8601 string format
  periodEndDate?: string; // ISO 8601 string format
  minimumBookingNotice: number;
  beforeEventBuffer: number;
  afterEventBuffer: number;
  scheduleId?: number;
  calendarSettingId: number;
  calendarSetting: CalendarSettingApiResponse;
  storeItemId: number;
  storeItem: StoreItem;
  schedule: ScheduleApiResponse;
}

export interface CalendarSettingApiResponse {
  id: number;
  minimumBookingNotice: number;
  beforeEventBuffer: number;
  afterEventBuffer: number;
  googleCalendar?: GoogleCalendarApiResponse;
  calendarProducts?: CalendarProductApiResponse[];
  schedules?: ScheduleApiResponse[];
  timeZone?: string;
  defaultScheduleId?: number;
  storeId: string;
  store: Store;
}

export interface GoogleCalendarApiResponse {
  id: number;
  email: string;
  createdAt: string; // ISO 8601 string format
  updatedAt: string; // ISO 8601 string format
  refreshToken: string;
  accessToken: string;
  bookings?: Booking[];
  calendarSettingId: number;
  calendarSetting: CalendarSettingApiResponse;
}

export interface BookingApiResponse {
  id: number;
  createdAt: string; // ISO 8601 string format
  updatedAt: string; // ISO 8601 string format
  storeId: string;
  store: Store;
  calendarProductId: number;
  calendarProduct?: CalendarProductApiResponse;
  title: string;
  description?: string;
  attendees?: Attendee[];
  startTime: string; // ISO 8601 string format
  endTime: string; // ISO 8601 string format
  googleCalendarId?: number;
  googleCalendar?: GoogleCalendarApiResponse;
  meetingUrl?: string;
  meetingPassword?: string;
  meetingId?: string;
  rescheduled?: boolean;
}
