export interface store {
  id: string;
  createdAt: string;
  userId: string;
  storeDescription: string;
  storeTitle: string;
  storeUrl: string;
  storeItems: storeItem[];
}

export interface storeItem {
  id: number;
  itemOrder: number;
  storeId: string;
  price: string;
  currency: string[];
  name: string;
  itemType: "DIGITALPRODUCT" | "CALENDAR";
  itemDetails: DigitalProductDetails | CalendarDetails;
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
