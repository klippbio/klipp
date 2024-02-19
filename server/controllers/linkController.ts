//TODO: add auth

import express from "express";
import { Request, Response } from "express";
import CustomError from "../utils/CustomError";
import {
  ZCreateLinkProductSchema,
  ZGetOrDeleteFile,
  deleteLink,
  getAllLinks,
} from "../services/link/linkService";
import { createLinkProduct } from "../services/link/linkService";

export const linkController = express.Router();

//TODO: add auth
linkController.post("/create", async (req: Request, res: Response) => {
  try {
    ZCreateLinkProductSchema.parseAsync(req.body);
    const productId = await createLinkProduct(req.body);
    res.status(201).json(productId);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

// ddController.get("/getProduct", async (req: Request, res: Response) => {
//   try {
//     const id = req.query.id;
//     const product = await getProduct(
//       await ZGetOrDeleteFile.parseAsync({ id: id })
//     );
//     res.status(201).json(product);
//   } catch (error) {
//     if (error instanceof CustomError)
//       res.status(error.statusCode).json({ error: error.message });
//     else res.status(500).json({ error: error });
//   }
// });

linkController.get("/getAllLinks", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const product = await getAllLinks(
      await ZGetOrDeleteFile.parseAsync({ id: id })
    );
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

linkController.delete("/deleteLink", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    await deleteLink(await ZGetOrDeleteFile.parseAsync({ id: id }));
    res.status(201).json("Link Deleted");
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
