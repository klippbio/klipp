import express, { Application } from "express";

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

//logging server status
try {
  app.listen(port, (): void => {
    console.log(`Backend Server running on port  ${port} 🚀`);
  });
} catch (error) {
  console.error("error");
}
