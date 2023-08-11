import express from "express";
import { Request, Response } from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { userRoute } from "./routes/UserRoute";

export const routes = express.Router();

routes.use("/user", userRoute);

routes.get("/api", async (req: Request, res: Response) => {
  res.json({ users: ["user1", "user2", "sesd"] });
});

routes.post("/api/validate", ClerkExpressRequireAuth(), async (req, res) => {
  res.send("validate1");
});
