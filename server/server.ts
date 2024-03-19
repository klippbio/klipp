import express, { Application } from "express";
import cron from "node-cron";
import axios from "axios";
import "dotenv/config";

import { routes } from "./routes";

const app: Application = express();
const port = process.env.PORT;

import { ClerkExpressWithAuth, StrictAuthProp } from "@clerk/clerk-sdk-node";

declare global {
  //eslint-disable-next-line
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ClerkExpressWithAuth());
app.use("/", routes);

// Run it every 2 hours
cron.schedule("0 */2 * * *", () => {
  console.log("Running a task every 2 hours");
  const serverUrl = `${process.env.BACKEND_URL}/analytics`;
  axios
    .get(serverUrl)
    .then(() => console.log("Analytics endpoint triggered successfully"))
    .catch((error) =>
      console.error("Error triggering analytics endpoint:", error)
    );
});

//run everyday at midnight
cron.schedule("0 0 * * *", function () {
  console.log("Running a task every day at midnight");
  axios
    .delete(process.env.BACKEND_URL + "/storeanalytics")
    .then(() => console.log("Successfully called /storeanalytics delete"))
    .catch((error) =>
      console.error("Error calling /storeanalytics delete:", error)
    );
});

//logging server status
try {
  app.listen(port, (): void => {
    console.log(`Backend Server running on port  ${port} 🚀`);
  });
} catch (error) {
  console.error("error");
}
