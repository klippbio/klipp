"use client";
import React from "react";
import { PaymentMethods } from "./components/PaymentMethods";
import PaymentDetails from "./components/PaymentDetails";

function Payments() {
  return (
    <div className="w-full">
      <div className="flex md:flex-row gap-4 flex-col w-full">
        <div className="md:w-2/3 w-full">
          <PaymentDetails />
        </div>
        <div className="md:w-1/3 w-full">
          <PaymentMethods />
        </div>
      </div>
      {/* <div className="w-full mt-4">
        <StripeComponent />
      </div> */}
    </div>
  );
}

export default Payments;
