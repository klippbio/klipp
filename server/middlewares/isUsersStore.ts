import clerkClient, { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { NextFunction, Request, Response } from "express";
import { getUserById } from "../services/userService";

export const isUsersStore = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  console.log("req.auth", req.auth);

  const clerkUser = await clerkClient.users.getUser(req.auth.userId);

  const dbUser = await getUserById(clerkUser.id);

  const storeId = req.body.storeId || req.query.storeId;

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
