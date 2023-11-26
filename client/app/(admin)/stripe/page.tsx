"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import AxiosApi from "@/app/services/axios";
import { useRouter } from "next/navigation";
import { AxiosResponse } from "axios";

function stripe() {
  const { data, isLoading } = useQuery(["allProducts"], async () => {
    const response = await AxiosApi("GET", `/api/stripe/accountDetails`);
    return response.data;
  });

  console.log(data);

  const router = useRouter();

  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await AxiosApi("POST", `/api/stripe/create/`);
      return response.data;
    },
    onSuccess: (data: any) => {
      console.log(data.url);
      router.push(data.url);
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to create product",
      });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <div className="p-4">
      <div>
        <Button onClick={handleClick}>Connect Stripe</Button>
      </div>
      {/* Displaying the Stripe Data */}
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h3>Stripe Data:</h3>
            <p>Stripe Id: {data[0].accountId}</p>

            <h3>Onboarding Status:</h3>
            <p>
              Onboarding Complete: {data[0].onboardingComplete ? "Yes" : "No"}
            </p>

            {/* Conditional Button Rendering */}
            {!data[0].onboardingComplete && (
              <Button onClick={handleClick}>Finish Onboarding</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default stripe;
