//TODO: add auth

import express from "express";
import { Request, Response } from "express";
import CustomError from "../utils/CustomError";
import {
  ZCreateDigitalProductSchema,
  ZAddDDFile,
  ZGetOrDeleteFile,
  deleteFile,
  getProduct,
} from "../services/dd/ddService";
import {
  createProduct,
  updateProduct,
  updateFile,
} from "../services/dd/ddService";

export const ddController = express.Router();

//TODO: add auth
ddController.post("/create", async (req: Request, res: Response) => {
  try {
    ZCreateDigitalProductSchema.parseAsync(req.body);
    const productId = await createProduct(req.body);
    res.status(201).json(productId);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

//TODO: add auth
//TODO: add validation to make sure that id belongs to sender
ddController.post("/update", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    //parsing is done in services
    const product = await updateProduct(id as string, req.body);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

//TODO: add auth
ddController.post("/file", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    ZAddDDFile.parseAsync(req.body);
    const product = await updateFile(
      await ZGetOrDeleteFile.parseAsync({ id: id }),
      req.body
    );
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

//TODO: add auth
ddController.delete("/file", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    await deleteFile(await ZGetOrDeleteFile.parseAsync({ id: id }));
    res.status(201).json("deleted");
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

ddController.get("/getProduct", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const product = await getProduct(
      await ZGetOrDeleteFile.parseAsync({ id: id })
    );
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
