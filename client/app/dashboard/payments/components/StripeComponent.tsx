import React, { useState, useEffect } from "react";
import {
  StripeConnectInstance,
  loadConnectAndInitialize,
} from "@stripe/connect-js/pure";
import {
  ConnectPayments,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import AxiosApi from "@/app/services/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthDetails } from "@/app/components/AuthContext";

export default function StripeComponent() {
  const authDetails = useAuthDetails();
  const storeId = authDetails?.storeId;
  const { data: accountDetails, isLoading: isAccountDetailsLoading } = useQuery(
    ["stripeAccountDetails", authDetails?.storeId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/stripe/stripeAccountDetails?storeId=${authDetails?.storeId}`
      );
      return response.data;
    },
    {
      enabled: !!authDetails?.storeId,
    }
  );

  const accountId = accountDetails?.accountId;

  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance | null>(null);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (accountId) {
        try {
          const response = await AxiosApi(
            "GET",
            `/api/stripe/account_session/?stripeAccountId=${accountId}&storeId=${storeId}`
          );
          setClientSecret(response.data.client_secret);
        } catch (error) {
          console.log("Error fetching client secret:", error);
          // Handle errors here
        }
      }
    };

    fetchClientSecret();
  }, [accountId, storeId]);

  useEffect(() => {
    if (clientSecret) {
      const connectInstance = loadConnectAndInitialize({
        publishableKey: "pk_test_A7jK4iCYHL045qgjjfzAfPxu",
        fetchClientSecret: () => Promise.resolve(clientSecret),
        fonts: [{ src: "next/font/google", family: "inter" }],
        appearance: {
          overlays: "dialog",
          variables: {
            fontFamily: "inter",
            colorPrimary: "#FF0000",
          },
        },
      });
      setStripeConnectInstance(connectInstance);
    }
  }, [clientSecret]);

  return (
    <div>
      {isAccountDetailsLoading ? (
        <div>
          {" "}
          <Card className=" overflow-hidden items-center justify-center">
            <CardHeader>
              <CardTitle className="text-foreground">Transactions</CardTitle>
              <CardDescription>
                Recent transactions made to your connected stripe account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Skeleton className="h-4 " />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 " />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 " />
              <Skeleton className="h-4 " />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          {!accountDetails ? (
            <div>
              <Card className="bg-secondary overflow-hidden items-center justify-center">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Transactions
                  </CardTitle>
                  <CardDescription>
                    Recent transactions made to your connected stripe account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Card className="flex w-full border-dashed border-2 h-60  justify-center ">
                    <div className="flex flex-col justify-center items-center">
                      <div className="text-l font-semibold text-foreground  ">
                        Stripe Account not Connected
                      </div>
                      <div className="mt-2 text-sm">
                        Connect your stripe account to see transaction details.
                      </div>
                    </div>
                  </Card>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div>
              <Card className="overflow-hidden items-center justify-center">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Transactions
                  </CardTitle>
                  <CardDescription>
                    Recent transactions made to your connected stripe account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <div className="items-center justify-center">
                    {stripeConnectInstance && (
                      <ConnectComponentsProvider
                        connectInstance={stripeConnectInstance}
                      >
                        <ConnectPayments />
                      </ConnectComponentsProvider>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
