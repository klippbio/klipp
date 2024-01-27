//TODO: If accountId is null, hide payment details -> Change whole controller
import AxiosApi from "@/app/services/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import getSymbolFromCurrency from "currency-symbol-map";

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
  const currencySymbol = getSymbolFromCurrency(currency);

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
          <Card className="bg-secondary">
            {!data ? (
              <div>
                {" "}
                <CardHeader>
                  <CardTitle className="text-foreground mb-8">
                    Payment Details
                  </CardTitle>
                  <CardContent className="flex flex-col gap-4">
                    <Card className="flex w-full border-dashed border-2 h-60 justify-center ">
                      <div className="flex flex-col justify-center items-center">
                        <div className="text-l font-semibold text-foreground  ">
                          Stripe Account not Connected
                        </div>
                        <div className="mt-2 text-sm">
                          Connect your stripe account to see payment details.
                        </div>
                      </div>
                    </Card>
                  </CardContent>
                </CardHeader>
              </div>
            ) : (
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
            )}
          </Card>
        </div>
      ) : (
        <div>
          <Card className="">
            <CardHeader>
              <CardTitle className="text-foreground">Payment Details</CardTitle>
              <CardContent>
                <div className="flex flex-col md:flex-row w-full gap-y-4">
                  <div className="flex flex-col w-full md:w-2/3  mt-6">
                    <div>Account Balance</div>
                    <div className="text-foreground mt-4 font-bold text-5xl">
                      {currencySymbol + "  "}
                      {totalBalance}
                    </div>
                    <div className=" mt-6 text-sm">
                      **Only available balance can be withdrawn.
                    </div>
                  </div>
                  <Card className="p-4 w-full mt-4 md:w-1/3 gap-4 bg-overlay justify-center ">
                    <div className="">
                      <div className="text-xl text-foreground font-semibold mb-2">
                        <h1>Balance Breakdown</h1>
                      </div>
                      <div className="text-foreground ">
                        Available = {currencySymbol} {availableBalance}
                      </div>
                      <div className="text-foreground">
                        Held By Stripe = {currencySymbol} {pendingBalance}
                      </div>
                      <Button className="mt-3" onClick={() => handlePayOut()}>
                        Pay Out
                      </Button>
                    </div>
                  </Card>
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
