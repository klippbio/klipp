import express from "express";
import { Request, Response } from "express";
import { google } from "googleapis";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

import * as publicService from "../services/public/publicService";
import CustomError from "../utils/CustomError";
import cityTimezones from "../services/calendar/cityTimezones";
import { isUsersStore } from "../middlewares/isUsersStore";

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

publicController.get("/analytics", async (req: Request, res: Response) => {
  try {
    const analytics = google.analytics("v3");
    const auth = new google.auth.GoogleAuth({
      keyFilename: "./aeric-416005-d8e5598e21c7.json", // Specify the path to your credentials file
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const viewId = "429901889"; // Replace this with your actual view ID

    const response = await analytics.data.ga.get({
      auth: auth,
      ids: "ga:" + viewId,
      "start-date": "30daysAgo",
      "end-date": "today",
      metrics: "ga:pageviews",
      filters: "ga:pagePath==/dashboard",
    });

    console.log("******", response.data);
    res.status(200).json({ response });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

publicController.get("/analytics2", async (req: Request, res: Response) => {
  try {
    const client = new BetaAnalyticsDataClient({
      credentials: {
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDEFneN5ig0I+94\nCgmHDpPUvvfxNdonuyZkVOkPktduevou9FFdhEDwajBI+1TeDQ+KDRZjm+uciiod\nUFLJitGGAio4Sgd70kG2rxJJ7O9v/113fyRn9jPlpA7pAHnRWRzLv2r9q7mP8iB+\nzviNLjPqD36Rg57ImeOM+Oz43B2Jhxrx11/js9yvpsInnC8rM0WBFLycHz06Nn8e\nvUsZexfkVlCPAq1SurF/J+8MIsIuemaij7JTuygvRgkANT0ZPloQDqCA70xSD1Wr\n6YndCu8ZyU1x2g96ju1ckxLmeN5fnnJY1ZAA0M6q8rjqEylzYlUvnAyrnUgEVS6L\nJCeSe84RAgMBAAECgf9CKDGJ0qPRhAymfTKY5RPT+Fiu3mwHhXWSn1ThuwHZ8nxv\nvY7W7fK5Ubfrn3C9yPkPb/8NYUjRakJBZozJk5mM6HzZZrEL/qXk8v5WLdIkq8vg\nYSk5WboVBVVk8g+kRqRS+OmF0906WwO17FmaJ5a4PWfIlkcTHv/r4iqHsa7wKdy0\nGIHkkd7TRk7lG2o+BUWCDpeheudCBQzwtW0iwzLjT7QUBoYpSgaAlTzh58AkqbcB\nkTg4q0yOnKUQsLGYrPabca1yBl0PEKU0G7SKGnOt9oFGOogFTYF8bISf4OylhV/Z\n+UraSzG+9AkseNH/OfeDEvFmjiK4ZNsnfX3Whh8CgYEA4NN6QPM73/wXMiFY2CJX\ndBZ+CnMyftk+AJ8lR1dletx6GxQQgofVht5KGRysmmCPYp7fMi4wzmpebGRH5pL4\nZZtJxVK5kvABtPQnjyiWiTHS3rbiRCZlkrvRn6CbCNaQUl5zRWC8brn/CYvnmihD\nDkSSzVZroXiR3QfPuLER7vcCgYEA30bhuH1UoKyrx8KvjgKDgVfoSV8ptQJ3hd/z\nfnZTF6A+ny3Z7K4wf1as08IL5VBvcfoJldzV/AA4JDwqF1GJpPWrp6OsWo4dtEoQ\nEmWHKETlIMZlsZYWd0JiXUenncrD9uYpjOp+GdRRsht/IzO6a62y0aDueYlRvaEo\npNrBgTcCgYBHAGJ2ippZJUrKCR/+ufG2drf9Yt4Kk17yYVArlJ02zNQ/IvoHzxAP\nFLp/7b9QzbfapGPGfDHrrkn9nznZxoZtyDnm+DYlAmj3lbe8jUvlLffzX/xbG2ku\niuQrrlPn2aMgcDWlLmSz70ds42MUGyz6H4vhDy7UgrhF/oaKRFluhwKBgQC5hnRY\nkAuZ1uCGBEdLgNs0xo7FKMXHGl2maAgztK4mm4htS/QgrjyuEp9Y9Yxc5xEza8g7\nNly4IJaFxVhUN/RflaMkkOPN+vjDribconBEDbs2GKS3gzb3sbl6OOgWPT3IEkfE\nR7SwUbPwgtiJr5nfj11ewpJleqzpHNhg40SW0QKBgCpA0vl+Azm1Sp2z8tpAIHjV\n5bg/cJiZ1Lm6vRH8uFtyf/tJzpWGvxWXFLtnf2z4Zaeu0ih5+yiB9Kt4OR3gj8OC\nuIOickUReHRZ9snfDYrhP9f4YMN7+usZCqvQCtDCXDo5BuS4ZlZzivgwiFhVo/+y\nrPGG7Ly7/aEAS1Gybr9o\n-----END PRIVATE KEY-----\n",
        client_email: "aeric-771@aeric-416005.iam.gserviceaccount.com",
      },
    });

    // Replace this with your actual GA4 property ID
    const propertyId = "429901889";

    // const [response] = await client.runReport({
    //   property: `properties/${propertyId}`,
    //   dateRanges: [
    //     {
    //       startDate: "2023-03-31",
    //       endDate: "today",
    //     },
    //   ],
    //   dimensions: [
    //     {
    //       name: "year",
    //     },
    //   ],
    //   metrics: [
    //     {
    //       name: "activeUsers",
    //     },
    //   ],
    // });

    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "2023-03-31",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "pagePath",
        },
      ],
      metrics: [
        {
          name: "activeUsers",
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            value: "/meetshukla",
            matchType: "EXACT",
          },
        },
      },
    });

    console.log("response", response);

    res.status(200).json({ dashboardPageViews: response });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
