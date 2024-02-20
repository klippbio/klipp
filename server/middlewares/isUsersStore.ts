import clerkClient, { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { NextFunction, Request, Response } from "express";
import { getUserById } from "../services/userService";

export const isUsersStore = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  if (!req.auth) {
    res.status(401).json({ error: "AuthInfo not available" });
  }
  const clerkUser = await clerkClient.users.getUser(req.auth.userId);

  console.log("clerkUser", clerkUser);

  const dbUser = await getUserById(clerkUser.id);

  console.log("dbUser", dbUser);

  console.log("req.body", req.body);
  console.log("req.query", req.query);

  const storeId = req.body.storeId || req.query.storeId;

  console.log("storeId", storeId);

  const hasMatchingStore =
    dbUser && dbUser.stores.some((store) => store.id === storeId);

  if (!hasMatchingStore) {
    res.status(403).json({
      error:
        "Access denied. The storeId does not match any of the user's stores.",
    });
    return;
  }

  next();
};
