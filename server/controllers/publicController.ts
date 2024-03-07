import express from "express";
import { Request, Response } from "express";

import * as publicService from "../services/public/publicService";
import CustomError from "../utils/CustomError";
import cityTimezones from "../services/calendar/cityTimezones";
import { isUsersStore } from "../middlewares/isUsersStore";
import axios from "axios";
export const publicController = express.Router();

publicController.get("/publicUser", async (req: Request, res: Response) => {
  try {
    const userName = req.query.username;
    const publicUser = await publicService.getPublicUser(
      await publicService.ZUserName.parseAsync({ userName: userName })
    );
    if (!publicUser) throw new CustomError("User not found", 404);
    res.status(200).json(publicUser);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

publicController.post(
  "/publicUser",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const parsedData = await publicService.ZUpdatePublicUser.parseAsync(
        req.body
      );
      const publicUser = await publicService.updatePublicUser(parsedData);
      if (!publicUser) throw new CustomError("User not found", 404);
      res.status(200).json(publicUser);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

publicController.post("/changeOrder", async (req: Request, res: Response) => {
  try {
    const parsedData = await publicService.ZChangeOrder.parseAsync(req.body);
    const updatedOrder = await publicService.changeOrder(parsedData);
    if (!updatedOrder)
      throw new CustomError("Failed to update item order", 500);
    res.status(200).json(updatedOrder);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

publicController.get("/product", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const username = req.query.username;
    const product = await publicService.getPublicProduct(
      await publicService.ZProduct.parseAsync({ id: id, userName: username })
    );
    if (!product) throw new CustomError("Product not found", 404);
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

publicController.get("/cityTimezones", async (req: Request, res: Response) => {
  try {
    const cities = await cityTimezones();
    res.status(200).json(cities);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

//TODO: Run a cron job to fetch the analytics data and save it to the database
publicController.get("/analytics", async (req: Request, res: Response) => {
  try {
    const posthogApiKey = process.env.POSTHOG_API_KEY;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${posthogApiKey}`,
    };

    const data = {
      query: {
        kind: "HogQLQuery",
        query: `SELECT 
        properties.$pathname AS path, 
        toDate(timestamp) AS event_date, 
        COUNT(*) AS event_count
      FROM 
        events
      WHERE 
        event = '$pageview'
        AND toDate(timestamp) >= today() - INTERVAL 8 DAY
        AND toDate(timestamp) <= today()
        AND toDate(timestamp) = today()
      GROUP BY 
        path, 
        toDate(timestamp)
      ORDER BY 
        path, 
        toDate(timestamp)`,
      },
    };

    const response = await axios.post(
      `https://app.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID}/query`,
      data,
      { headers }
    );

    const result = await publicService.saveOrUpdateAnalytics(
      response.data.results
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching event count by date:", error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

publicController.get("/storeanalytics", async (req: Request, res: Response) => {
  try {
    let storeUrl = req.query.storeurl;
    storeUrl = "/" + storeUrl;
    const storeAnalytics = await publicService.getStoreAnalytics(
      await publicService.ZStoreUrl.parseAsync({ storeUrl: storeUrl })
    );
    res.status(200).json(storeAnalytics);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

publicController.delete(
  "/storeanalytics",
  async (req: Request, res: Response) => {
    try {
      const results = await publicService.deleteStoreAnalytics();
      res.status(200).json(results);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);
