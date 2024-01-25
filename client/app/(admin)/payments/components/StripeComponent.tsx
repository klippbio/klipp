import Script from "next/script";
import React, { useState } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js/pure";
import {
  ConnectPayments,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

export default function StripeComponent() {
  const [stripeConnectInstance] = useState(() => {
    const fetchClientSecret = async () => {
      // Fetch the AccountSession client secret
      const response = await fetch("/api/stripe/account_session", {
        method: "POST",
      });
      if (!response.ok) {
        // Handle errors on the client side here
        const { error } = await response.json();
        console.log("An error occurred: ", error);
        return undefined;
      } else {
        const { client_secret: clientSecret } = await response.json();
        return clientSecret;
      }
    };
    return loadConnectAndInitialize({
      // This is your test publishable API key.
      publishableKey:
        "pk_test_51ODeaHKiQFEEPGdjiRhjxO9SISCnKaLbVrsodYC9kXe9IBrDCdfVaX0oEQvF4PvYoIPVWR5mV6W8bzwoABOoZZSA00TFmfyrk2",
      fetchClientSecret: fetchClientSecret,
      appearance: {
        overlays: "dialog",
        variables: {
          colorPrimary: "#625afa",
        },
      },
    });
  });

  return (
    <div>
      <div className="container">
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          <ConnectPayments />
        </ConnectComponentsProvider>
      </div>
    </div>
  );
}
