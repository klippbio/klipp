"use client";
import React from "react";
import ProfileForm from "./profileForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import AxiosApi from "@/app/services/axios";
import { useAuthDetails } from "@/app/components/AuthContext";

function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authDetails = useAuthDetails();

  const id = searchParams.get("id");
  if (!id) {
    return router.push("/");
  }
  const productId = id ? parseInt(id as string) : null;

  const { data, isLoading } = useQuery(
    ["product", productId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/digital-downloads/getproduct/?id=${productId}`,
        authDetails
      );
      return response.data;
    },
    {
      cacheTime: 0,
    }
  );
  return (
    <div>
      {isLoading ? (
        <Card className="md:w-1/2">
          <Skeleton className="h-6 w-1/2 m-4" />
          <Skeleton className="h-4 w-10/12 m-4" />
          <Skeleton className="h-4 w-10/12 m-4" />
          <Skeleton className="h-4 w-10/12 m-4" />
        </Card>
      ) : (
        <ProfileForm data={data} productId={productId || 0}></ProfileForm>
      )}
    </div>
  );
}

export default page;
