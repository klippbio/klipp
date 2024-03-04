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

//TODO
/* 
Collect only pageview events 
Make it dynamic 
Dont save home page and /dashboard and /sign-in /singup 
*/

// publicController.get("/analytics/", async (req: Request, res: Response) => {
//   try {
//     // Retrieve date parameters from the request query, with defaults if not provided
//     const {
//       // dateFrom = "1609483395.338",
//       // dateTo = "1709488905",
//       path = "/nonexistant",
//     } = req.query;

//     // const thirtyDaysAgo = new Date();
//     // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//     // const defaultAfter = encodeURIComponent(thirtyDaysAgo.toISOString()); // Encoded 30 days ago timestamp
//     // const defaultBefore = encodeURIComponent(new Date().toISOString()); // Encoded current timestamp

//     // const {
//     //   dateFrom = defaultAfter,
//     //   dateTo = defaultBefore,
//     //   pathname = "/aeric",
//     // } = req.query;

//     const posthogApiKey: string =
//       "phx_d2XebPoWkHYH6FJzq3Egp8aZ43FLRYYxq8OyTKpr217";
//     const posthogHost: string = "https://app.posthog.com";
//     const apiUrl: string = `${posthogHost}/api/projects/56613/events/`;

//     const response = await axios.get(apiUrl, {
//       headers: {
//         Authorization: `Bearer ${posthogApiKey}`,
//       },
//       params: {
//         event: "$pageview",
//         properties: JSON.stringify([
//           {
//             key: "$pathname",
//             value: path,
//             operator: "exact",
//             type: "event",
//           },
//         ]),
//         dateRange: {
//           date_to: "-30d",
//           date_from: "-20d",
//         },
//       },
//     });

//     // Aggregate the event count per date
//     // const eventCountsByDate: { [key: string]: number } = {};

//     // //eslint-disable-next-line
//     // response.data.results.forEach((event: any) => {
//     //   // Extract the date from the timestamp
//     //   const eventDate = event.timestamp.split("T")[0];

//     //   // Initialize or increment the count for this date
//     //   if (!eventCountsByDate[eventDate]) {
//     //     eventCountsByDate[eventDate] = 1;
//     //   } else {
//     //     eventCountsByDate[eventDate]++;
//     //   }
//     // });

//     res.status(200).json(response.data.results);
//   } catch (error) {
//     console.error("Error fetching event count by date:", error);
//     if (axios.isAxiosError(error) && error.response) {
//       // This will capture any non-200 responses from the PostHog API and provide the status code and message
//       res.status(error.response.status).json({ error: error.message });
//     } else {
//       // Generic error fallback
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// });

publicController.get("/analytics", async (req: Request, res: Response) => {
  try {
    const path = req.query.path; // Assuming the query parameter is named 'path'

    // Validate the path to ensure it's a safe and usable string
    if (!path || typeof path !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid or missing path parameter." });
    }

    const posthogApiKey = process.env.POSTHOG_API_KEY;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${posthogApiKey}`,
    };

    const data = {
      query: {
        kind: "HogQLQuery",
        query: `
          SELECT toDate(timestamp) AS event_date, COUNT(*) AS event_count
          FROM events
          WHERE event = '$pageview'
                AND toDate(timestamp) >= today() - INTERVAL 30 DAY
                AND toDate(timestamp) <= today()
                AND properties.$current_url LIKE '%${path}%'
          GROUP BY toDate(timestamp)
          ORDER BY toDate(timestamp)
        `,
      },
    };

    const response = await axios.post(
      `https://app.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID}/query`,
      data,
      { headers }
    );
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error("Error fetching event count by date:", error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
