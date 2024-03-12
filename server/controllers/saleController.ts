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

type emailDataType = {
  from_name: string;
  to_email: string;
  to_name: string;
  subject: string;
  link: string;
  itemType: string;
};

export async function emailTrigger(data: emailDataType) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const downloadLink = data.link;
  const toName = data.to_name;
  const fromName = data.from_name;
  let htmlContent;

  if (data.itemType === "CALENDAR") {
    htmlContent = render(CalendarEmail({ downloadLink, toName, fromName }));
  } else {
    htmlContent = render(DdEmail({ downloadLink, toName }));
  }

  try {
    const result = await resend.emails.send({
      from: `${data.from_name} <orders@klipp.io>`,
      to: [`${data.to_email}`],
      subject: data.subject,
      html: htmlContent,
    });
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
}

export const saleController = express.Router();

saleController.post("/create", async (req: Request, res: Response) => {
  try {
    const { itemType }: { itemType: StoreItemType } = req.body;
    if (itemType === "CALENDAR") {
      await ZCreateNewSaleSchema.parseAsync(req.body);
      const sale = await createNewSale(req.body);
      if (req.body.price === "0") {
        await updateSaleStatus(sale.id, "COMPLETED");
        const link = process.env.FRONTEND_URL + "/sale/" + sale.id;
        const saleEmail = {
          from_name: req.body.storeUrl,
          to_email: req.body.saleFormData.email,
          to_name: req.body.saleFormData.name,
          subject: "Meeting with " + req.body.storeUrl,
          link: link,
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
          to_email: req.body.saleFormData.email,
          to_name: req.body.saleFormData.name,
          subject: "Your purchase from " + req.body.storeUrl,
          itemType: "CALENDAR",
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
          to_name: req.body.saleFormData.name,
          subject: "Your purchase from " + req.body.storeUrl,
          link: link,
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
          to_email: req.body.saleFormData.email,
          to_name: req.body.saleFormData.name,
          subject: "Your purchase from " + req.body.storeUrl,
          itemType: "DIGITAL_DOWNLOAD",
        };
        const link = await createCheckoutSession(combinedData);
        res.status(200).json(link);
      }
    }
  } catch (error) {
    console.log(error);
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
      console.log(error);
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
    console.log(error);
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
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

saleController.post("/reschedule", async (req: Request, res: Response) => {
  try {
    const sale = await rescheduleSale(req.body);
    res.status(200).json(sale);
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
