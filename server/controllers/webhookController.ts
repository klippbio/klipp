import express from "express";
import { handleUpdateAccount } from "../services/payment/paymentService";
import { updateSaleStatus } from "../services/sale/saleService";
const stripe = require("stripe")(
  "sk_test_51ODeaHKiQFEEPGdjBvEPJUUSO6mstnNQFzy03aRDJxTVfgXriuthpcZ6j2ppMJjR1vVXtQqOUBxekyCKUl4cYOAR003xGDEGAI"
);
const endpointSecret = "whsec_Bq08uZYQEtlVkyCAOtdv01TrLCgd89bL";
export const webhookController = express.Router();

// webhookController.post("/", async (req: Request, res: Response) => {
//   try {
//     console.log("entry to webhook1", req.body);
//     if (req.body.type === "account.updated") {
//       handleUpdateAccount(req.body.data.object);
//     }

//     if (req.body.type === "checkout.session.completed") {
//       console.log("entry to webhook2", req.body);
//       const session = req.body;

//       const saleId = session.data.object.metadata.saleId;
//       console.log("sale id in webhook", saleId);
//       await updateSaleStatus(saleId, "COMPLETED");
//       console.log("Edit webhook");
//     }
//   } catch (error) {
//     console.log(error);
//     if (error instanceof CustomError)
//       res.status(error.statusCode).json({ error: error.message });
//     else res.status(500).json({ error: error });
//   }
// });

// Your existing endpoint modified according to the Stripe example
webhookController.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(`Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "account.updated":
      // eslint-disable-next-line
      const updatedAccount = event.data.object; // Add your logic here
      handleUpdateAccount(updatedAccount);
      break;
    case "checkout.session.completed":
      // eslint-disable-next-line
      const session = event.data.object;
      // eslint-disable-next-line
      const saleId = session.metadata.saleId; // Assuming saleId is stored in metadata
      await updateSaleStatus(saleId, "COMPLETED");
      console.log("Checkout session completed");
      break;
    // Add more case statements for other event types you need to handle
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});
