import express, { Request, Response } from "express";
import CustomError from "../utils/CustomError";
import {
  ZCreateNewSaleSchema,
  cancelGoogleCalendarSale,
  createNewSale,
  getAllSales,
  getSale,
  rescheduleSale,
  updateSaleStatus,
} from "../services/sale/saleService";
import { StoreItemType } from "@prisma/client";
import createCheckoutSession from "./paymentController";
import { isUsersStore } from "../middlewares/isUsersStore";

import { Resend } from "resend";
import { DdEmail } from "../emails/ddEmail";
import { render } from "@react-email/render";
import { CalendarEmail } from "../emails/calendarEmail";
import { getStoreFromStoreUrl } from "../services/storeService";
import { NewSaleEmail } from "../emails/newSaleEmail";
import { MeetingCreatedEmail } from "../emails/meetingCreatedEmail";
import dayjs = require("dayjs");
import { MeetingCancelledEmail } from "../emails/meetingCancelledEmail";
import { MeetingRescheduledEmail } from "../emails/meetingRescheduledEmail";

type emailDataType = {
  from_name: string;
  from_email?: string;
  to_email: string;
  to_name: string;
  subject: string;
  link: string;
  itemType: string;
  itemName: string;
};

type meetingEmail = {
  toName: string;
  toEmail: string;
  fromEmail?: string;
  itemName: string;
  meetingDetails: Date;
  newMeetingDetails?: Date;
};
export async function emailTrigger(data: emailDataType) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const downloadLink = data.link;
  const toName = data.to_name;
  const fromName = data.from_name;
  const itemName = data.itemName;
  let htmlContent;

  if (data.itemType === "CALENDAR") {
    htmlContent = render(CalendarEmail({ downloadLink, toName, fromName }));
  } else {
    htmlContent = render(DdEmail({ downloadLink, toName }));
  }

  try {
    await resend.emails.send({
      from: `${data.from_name} <orders@klipp.io>`,
      to: [`${data.to_email}`],
      subject: data.subject,
      html: htmlContent,
    });
    await resend.emails.send({
      from: `New Sale <orders@klipp.io>`,
      to: [`${data.from_email}`],
      subject: "Yay! you made a sale on klipp",
      html: render(NewSaleEmail({ itemName, fromName })),
    });

    return "success";
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
}

export async function meetingCreatedEmail(data: meetingEmail) {
  const formattedDate = dayjs(data.meetingDetails).format("MMMM D, YYYY HH:mm");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const toName = data.toName;
  const toEmail: string = data.toEmail;
  const meetingDetails = formattedDate;
  const itemName = data.itemName;

  try {
    await resend.emails.send({
      from: `New Meeting Created <orders@klipp.io>`,
      to: toEmail,
      subject: "New Meeting Details - klipp",
      html: render(MeetingCreatedEmail({ itemName, meetingDetails, toName })),
    });

    return "success";
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
}

export async function meetingCancelledEmail(data: meetingEmail) {
  const formattedDate = dayjs(data.meetingDetails).format("MMMM D, YYYY HH:mm");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = data.fromEmail;
  const toEmail: string = data.toEmail;
  const meetingDetails = formattedDate;
  const itemName = data.itemName;

  try {
    await resend.emails.send({
      from: `Meeting <orders@klipp.io>`,
      to: [`${toEmail}`],
      bcc: `${fromEmail}`,
      subject: "Meeting Cancelled - klipp",
      html: render(MeetingCancelledEmail({ itemName, meetingDetails })),
    });

    return "success";
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
}

export async function meetingRescheduledEmail(data: meetingEmail) {
  const formattedDate = dayjs(data.meetingDetails).format("MMMM D, YYYY HH:mm");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = data.fromEmail;
  const toEmail: string = data.toEmail;
  const meetingDetails = formattedDate;
  const newMeetingDetails = dayjs(data.newMeetingDetails).format(
    "MMMM D, YYYY HH:mm"
  );
  const itemName = data.itemName;

  try {
    await resend.emails.send({
      from: `Meeting <orders@klipp.io>`,
      to: [`${toEmail}`],
      bcc: `${fromEmail}`,
      subject: "Meeting Rescheduled - klipp",
      html: render(
        MeetingRescheduledEmail({ itemName, meetingDetails, newMeetingDetails })
      ),
    });

    return "success";
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
}

export const saleController = express.Router();

saleController.post("/create", async (req: Request, res: Response) => {
  try {
    const storeDetails = await getStoreFromStoreUrl(req.body.storeUrl);
    const { itemType }: { itemType: StoreItemType } = req.body;
    if (itemType === "CALENDAR") {
      await ZCreateNewSaleSchema.parseAsync(req.body);
      const sale = await createNewSale(req.body);
      if (req.body.price === "0") {
        await updateSaleStatus(sale.id, "COMPLETED");
        const link = process.env.FRONTEND_URL + "/sale/" + sale.id;
        const saleEmail = {
          from_name: req.body.storeUrl,
          from_email: storeDetails?.user.email,
          to_email: req.body.saleFormData.email,
          to_name: req.body.saleFormData.name,
          subject: "Meeting with " + req.body.storeUrl,
          link: link,
          itemName: req.body.productName,
          itemType: "CALENDAR",
        };
        await emailTrigger(saleEmail);
        res.status(200).json(link);
      } else {
        const data = req.body;
        const combinedData = {
          ...data,
          saleId: sale.id,
          from_name: req.body.storeUrl,
          from_email: storeDetails?.user.email,
          to_email: req.body.saleFormData.email,
          to_name: req.body.saleFormData.name,
          subject: "Your purchase from " + req.body.storeUrl,
          itemName: req.body.productName,
          itemType: "CALENDAR",
          storeId: storeDetails?.id,
        };
        const link = await createCheckoutSession(combinedData);
        res.status(200).json(link);
      }
    } else {
      const sale = await createNewSale(req.body);
      if (req.body.price === "0") {
        await updateSaleStatus(sale.id, "COMPLETED");
        const link = process.env.FRONTEND_URL + "/sale/" + sale.id;
        const saleEmail = {
          from_name: req.body.storeUrl,
          to_email: req.body.saleFormData.email,
          from_email: storeDetails?.user.email,
          to_name: req.body.saleFormData.name,
          subject: "Your purchase from " + req.body.storeUrl,
          link: link,
          itemName: req.body.productName,
          itemType: "DIGITAL_DOWNLOAD",
        };
        await emailTrigger(saleEmail);
        res.status(200).json(link);
      } else {
        const data = req.body;
        const combinedData = {
          ...data,
          saleId: sale.id,
          from_name: req.body.storeUrl,
          from_email: storeDetails?.user.email,
          to_email: req.body.saleFormData.email,
          to_name: req.body.saleFormData.name,
          subject: "Your purchase from " + req.body.storeUrl,
          itemName: req.body.productName,
          itemType: "DIGITAL_DOWNLOAD",
          storeId: storeDetails?.id,
        };
        console.log("combinedData", combinedData);
        const link = await createCheckoutSession(combinedData);
        res.status(200).json(link);
      }
    }
  } catch (error) {
    console.log("Error Occured at", req.url, "Error Details: ", error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

saleController.get(
  "/getAllSales",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const storeId = req.query.storeId;
      if (!storeId) throw new CustomError("Store id not Found!", 400);
      const sales = await getAllSales(storeId as string);
      res.status(200).json(sales);
    } catch (error) {
      console.log("Error Occured at", req.url, "Error Details: ", error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

saleController.get("/", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    //check if id is a string
    if (typeof id !== "string") throw new CustomError("Invalid id", 400);
    const sale = await getSale(String(id));
    res.status(200).json(sale);
  } catch (error) {
    console.log("Error Occured at", req.url, "Error Details: ", error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

saleController.post("/cancel", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const sale = await cancelGoogleCalendarSale(String(id));
    res.status(200).json(sale);
  } catch (error) {
    console.log("Error Occured at", req.url, "Error Details: ", error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

saleController.post("/reschedule", async (req: Request, res: Response) => {
  try {
    const sale = await rescheduleSale(req.body);
    const link = sale && process.env.FRONTEND_URL + "/sale/" + sale.id;
    res.status(200).json(link);
  } catch (error) {
    console.log("Error Occured at", req.url, "Error Details: ", error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
