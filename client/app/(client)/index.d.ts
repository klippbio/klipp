import { booking } from "./index.d";

export interface storeItem {
  id: number;
  itemOrder: number;
  storeId: string;
  price: string;
  currency: string[];
  name: string;
  itemType: "DIGITALPRODUCT" | "CALENDAR" | "LINK";
  thumbnailUrl: string;
  linkUrl: string;
  itemDetails: DigitalProductDetails | CalendarDetails;
  itemTypeId?: number;
}

export interface store {
  id: string;
  createdAt: string;
  userId: string;
  storeDescription: string;
  storeTitle: string;
  storeUrl: string;
  storeItems: storeItem[];
  user?: user;
  color: string;
  thumbnailUrl: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
}

export interface user {
  id: string;
  createdAt: string;
  email: string;
  thumbnailUrl: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  color: string;
  storeItems: StoreItem[];
}

export interface booking {
  id: number;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  calendarProductId: number;
  title: string;
  description: null | string;
  startTime: string;
  endTime: string;
  googleCalendarId: number;
  meetingUrl: string;
  meetingPassword: null | string;
  meetingId: string;
  rescheduled: boolean;
  cancelSaleId: null | number;
  bookingStatus: "SCHEDULED" | "CANCELLED";
  saleId: number;
}

export interface sale {
  id: number;
  createdAtx: string;
  updatedAt: string;
  storeId: string;
  storeItemId: number;
  salePrice: string;
  buyerEmail: string;
  buyerName: string;
  status: "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED" | "REFUNDPENDING";
  additionalInfo: null | string;
  storeItem: storeItem;
  booking?: booking;
  store?: store;
}

//productTypings:
export type DigitalProductDetails = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  price: string;
  recPrice: string;
  minPrice: string;
  description: string;
  currency: string[];
  storeItemId: number;
  shortDescription: string;
  flexPrice: boolean;
  externalFile: boolean;
  visibility: boolean;
  urls: string;
  thumbnailUrl: string;
  createdBy: null | string;
};

export type CalendarDetails = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  thumbnailUrl: string;
  shortDescription: string;
  description: string;
  length: number;
  hidden: boolean;
  timeZone: null | string;
  price: string;
  recPrice: string;
  minPrice: string;
  flexPrice: boolean;
  currency: string[];
  periodType: string;
  periodStartDate: null | string;
  periodEndDate: null | string;
  minimumBookingNotice: number;
  beforeEventBuffer: number;
  afterEventBuffer: number;
  scheduleId: number;
  calendarSettingId: number;
  storeItemId: number;
  name: string;
};
