//TODO: If accountId is null, hide payment details -> Change whole controller
import AxiosApi from "@/app/services/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

function PaymentDetails() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["stripeAccountDetails"], async () => {
    const accountDetails = await AxiosApi(
      "GET",
      `/api/stripe/stripeAccountDetails`
    );
    return accountDetails.data;
  });

  const accountId = data?.accountId;
  console.log(accountId);
  const { data: balanceData, isLoading: isBalanceLoading } = useQuery(
    ["stripeBalance"],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/stripe/stripeaccountbalance?stripeAccountId=${accountId}`
      );
      return response.data;
    },
    {
      enabled: !!accountId,
    }
  );

  const availableBalance = balanceData?.available[0].amount / 100;
  const pendingBalance = balanceData?.pending[0].amount / 100;
  const totalBalance = availableBalance + pendingBalance;
  const currency = balanceData?.available[0].currency.toUpperCase();

  const payOutMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await AxiosApi("POST", `/api/stripe/payout`, data);
      await queryClient.invalidateQueries(["stripeBalance"]);
      return response.data;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Success",
        duration: 2000,
        description: "Funds successfully transferred to your account",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to connect to Stripe",
      });
    },
  });

  const handlePayOut = async () => {
    payOutMutation.mutate(data);
  };

  return (
    <div>
      {isLoading || isBalanceLoading ? (
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground mb-4">
                Payment Details
              </CardTitle>
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
            </CardHeader>
          </Card>
        </div>
      ) : (
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Payment Details</CardTitle>
              <CardContent>
                <div className="flex flex-col md:flex-row w-full gap-y-4">
                  <div className="flex flex-col w-full md:w-2/3  mt-6">
                    <div>Account Balance</div>
                    <div className="text-foreground mt-4 font-bold text-5xl">
                      {currency}
                      {totalBalance}
                    </div>
                  </div>
                  <div className="w-full md:w-1/3">
                    <div className="text-2xl font-semibold mb-2">
                      <h1>Balances</h1>
                    </div>
                    <div className="text-foreground ">
                      Available - {currency} {availableBalance}
                    </div>
                    <div className="text-foreground">
                      Pending - {currency} {pendingBalance}
                    </div>
                    <Button className="mt-2 " onClick={() => handlePayOut()}>
                      Pay Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
}

export default PaymentDetails;
