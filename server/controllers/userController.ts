import express from "express";
import { Request, Response } from "express";
import clerkClient, { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

import * as userService from "../services/userService";
import * as storeService from "../services/storeService";

export const userController = express.Router();

userController.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await userService.allUsers();
    if (users) {
      return res.status(200).json(users);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

userController.post("/onboarding", async (req: Request, res: Response) => {
  try {
    const usernameExists = await storeService.checkStoreUrlExists(
      req.body.username
    );
    if (usernameExists) {
      return res.status(409).json({ error: "Username already exists" });
    }
    const onboardingInput = await userService.ZOnboardingInputSchema.parseAsync(
      req.body
    );

    const newUser = await userService.onboarding(onboardingInput);
    await clerkClient.users.updateUserMetadata(onboardingInput.userId, {
      publicMetadata: {
        storeUrl: onboardingInput.username.toLowerCase(),
        onboarded: true,
        storeId: newUser.stores[0].id,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

userController.post(
  "/onboarding/socials",
  async (req: Request, res: Response) => {
    try {
      const parsedData = await userService.ZOnboardingSocials.parseAsync(
        req.body
      );

      await userService.onboardingSocials(parsedData);

      return res.status(201).json("newUser");
    } catch (error) {
      console.error("An error occurred:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

userController.get(
  "/",
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    try {
      const userId = req.query.id;
      if (userId) {
        const user = await userService.getUserById(userId as string);
        if (user) {
          return res.status(200).json(user);
        }
      }
      return res.status(404).json("User Id not found");
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

userController.get(
  "/check",
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    console.log("Entered clerk:", req);
    try {
      const clerkUser = await clerkClient.users.getUser(req.auth.userId);
      console.log("cluerk user:", clerkUser);
      if (
        clerkUser.unsafeMetadata === null ||
        clerkUser.unsafeMetadata === undefined ||
        Object.keys(clerkUser.unsafeMetadata).length === 0
      ) {
        return res.redirect(process.env.FRONTEND_URL + "/onboarding");
      }
      return res.redirect(process.env.FRONTEND_URL + "/dashboard");
    } catch (error) {
      console.log("An error occurred:", error);
      return res.status(500).json(error);
    }
  }
);

//
