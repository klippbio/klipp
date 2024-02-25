"use client";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import AxiosApi from "@/app/services/axios";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthDetails } from "@/app/components/AuthContext";

const FormSchema = z.object({
  country: z.string({
    required_error: "Please select your country to get started.",
  }),
  storeId: z.string().optional(),
});

type dataType = {
  country: string;
};

export function PaymentMethods() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const authDetails = useAuthDetails();

  const queryClient = useQueryClient();

  const router = useRouter();

  const { toast } = useToast();

  const { data, isLoading } = useQuery(
    ["stripeAccountDetails", authDetails?.storeId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/stripe/stripeAccountDetails?storeId=${authDetails.storeId}`
      );
      return response.data;
    },
    {
      enabled: !!authDetails.storeId,
    }
  );

  const accountStatus = useMemo(() => {
    if (isLoading) {
      return "loading";
    } else if (!data) {
      return "new";
    } else if (data.onboardingComplete === false) {
      return "pending";
    } else {
      return "connected";
    }
  }, [data, isLoading]);

  const isSelectDisabled = useMemo(
    () => accountStatus !== "new",
    [accountStatus]
  );

  const mutation = useMutation({
    mutationFn: async (data: dataType) => {
      const response = await AxiosApi("POST", `/api/stripe/connect/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      router.push(data.url);
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to redirect to Stripe",
      });
    },
  });

  const pendingMutation = useMutation({
    mutationFn: async (data: dataType) => {
      const response = await AxiosApi(
        "POST",
        `/api/stripe/pendingAccount/`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      router.push(data.url);
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

  const disconnectMutation = useMutation({
    mutationFn: async (data: dataType) => {
      await AxiosApi("POST", `/api/stripe/disconnect/`, data, authDetails);
      await queryClient.invalidateQueries(["stripeAccountDetails"]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        "stripeAccountDetails",
        authDetails?.storeId,
      ]);
      toast({
        title: "Success",
        duration: 2000,
        description: "Account disconnected",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to disconnect Stripe",
      });
    },
  });

  const redirectMutation = useMutation({
    mutationFn: async (data) => {
      const response = await AxiosApi(
        "POST",
        `/api/stripe/dashboard/`,
        data,
        authDetails
      );
      return response.data;
    },
    onSuccess: (data) => {
      router.push(data.url);
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to redirect to Stripe",
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const combinedData = { ...data, storeId: authDetails.storeId };
    mutation.mutate(combinedData);
  }

  function pendingSubmit() {
    const combinedData = { ...data, storeId: authDetails.storeId };
    pendingMutation.mutate(combinedData);
  }

  function disconnectSubmit() {
    const combinedData = { ...data, storeId: authDetails.storeId };
    disconnectMutation.mutate(combinedData);
  }

  function handleDashboardRedirect() {
    const combinedData = { ...data, storeId: authDetails.storeId };
    redirectMutation.mutate(combinedData);
  }

  return (
    <div>
      {isLoading && !data ? (
        <div>
          {" "}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Payment Methods</CardTitle>
              <CardDescription>
                Connect your Stripe account to accept payments.
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
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Payment Methods</CardTitle>
              <CardDescription>
                Connect your Stripe account to accept payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <img src="/stripe.png" alt="stripe logo" />
              </div>
              <div>
                {accountStatus === "new" && (
                  <Form {...form}>
                    <form
                      className=" space-y-6"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSelectDisabled}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <ScrollArea className="h-72 w-full">
                                  <div>
                                    <SelectItem value="US">
                                      United States
                                    </SelectItem>
                                    <SelectItem value="CA">Canada</SelectItem>
                                    <SelectItem value="AU">
                                      Australia
                                    </SelectItem>
                                    <SelectItem value="AT">Austria</SelectItem>
                                    <SelectItem value="BE">Belgium</SelectItem>
                                    <SelectItem value="BG">Bulgaria</SelectItem>
                                    <SelectItem value="DK">Denmark</SelectItem>
                                    <SelectItem value="EE">Estonia</SelectItem>
                                    <SelectItem value="FR">France</SelectItem>
                                    <SelectItem value="FI">Finland</SelectItem>
                                    <SelectItem value="DE">Germany</SelectItem>
                                    <SelectItem value="GR">Greece</SelectItem>
                                    <SelectItem value="HK">
                                      Hong Kong
                                    </SelectItem>
                                    <SelectItem value="HU">Hungary</SelectItem>
                                    <SelectItem value="IE">Ireland</SelectItem>
                                    <SelectItem value="IT">Italy</SelectItem>
                                    <SelectItem value="JP">Japan</SelectItem>
                                    <SelectItem value="LV">Latvia</SelectItem>
                                    <SelectItem value="NL">
                                      Netherlands
                                    </SelectItem>
                                    <SelectItem value="NZ">
                                      New Zealand
                                    </SelectItem>
                                    <SelectItem value="NO">Norway</SelectItem>
                                    <SelectItem value="PL">Poland</SelectItem>
                                    <SelectItem value="PT">Portugal</SelectItem>
                                    <SelectItem value="RO">Romania</SelectItem>
                                    <SelectItem value="SG">
                                      Singapore
                                    </SelectItem>
                                    <SelectItem value="ES">Spain</SelectItem>
                                    <SelectItem value="SE">Sweden</SelectItem>
                                    <SelectItem value="CH">
                                      Switzerland
                                    </SelectItem>
                                    <SelectItem value="GB">
                                      United Kingdom
                                    </SelectItem>
                                  </div>
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center gap-4 mt-6">
                        {accountStatus === "new" && (
                          <Button type="submit">
                            <span>Connect Stripe</span>
                            {mutation.isLoading && (
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            )}
                          </Button>
                        )}
                        {accountStatus === "new" && (
                          <Badge className="h-8 ml-auto" variant="secondary">
                            <span>Stripe not connected</span>
                          </Badge>
                        )}
                      </div>
                    </form>
                  </Form>
                )}
                <div className="flex items-center">
                  {accountStatus === "pending" && (
                    <div className="flex gap-4 w-2/3">
                      <Button onClick={() => pendingSubmit()}>
                        <span className="">Continue Onboarding</span>
                        {mutation.isLoading && (
                          <Loader2 className="ml-2 animate-spin" />
                        )}
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    {accountStatus === "connected" && (
                      <div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant={"destructive"}
                              className="w-16 md:w-fit"
                            >
                              <span className="sm:text-xs">Disconnect</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to disconnect stripe
                                account?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will disconnect your stripe account. You
                                will no longer be able to accept payments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive"
                                onClick={() => disconnectSubmit()}
                              >
                                Continue
                                {mutation.isLoading && (
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}

                    {accountStatus === "connected" && (
                      <Button
                        variant={"outline"}
                        onClick={() => handleDashboardRedirect()}
                      >
                        <span className="">
                          <div className="text-xs">Stripe Dashboard</div>
                        </span>
                        {mutation.isLoading && (
                          <Loader2 className="ml-2 animate-spin" />
                        )}
                      </Button>
                    )}
                    {accountStatus === "pending" && (
                      <Badge className="h-8 ml-auto" variant="secondary">
                        <span>Connection Incomplete</span>
                      </Badge>
                    )}
                    {accountStatus === "connected" && (
                      <Badge
                        className="h-8 ml-auto text-center"
                        variant="secondary"
                      >
                        <span>
                          <div className="text-xs">Stripe Connected</div>
                        </span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
