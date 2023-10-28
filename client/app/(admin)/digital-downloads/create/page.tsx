"use client";
import React from "react";
import ProfileForm from "./profileForm";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  if (!id) {
    return router.push("/");
  }
  const productId = id ? parseInt(id as string) : null;

  const { data, isLoading } = useQuery(
    ["product", productId],
    async () => {
      const response = await axios.get(
        `/api/digital-downloads/getproduct/?id=${productId}`
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
        <Card className=" m-4 lg:w-2/3">
          <div className="text-center">
            <Skeleton className="h-8 w-40 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-120 m-4" />
            <Skeleton className="h-4 w-120 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-120 m-4" />
            <Skeleton className="h-4 w-120 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-120 m-4" />
            <Skeleton className="h-4 w-120 m-4" />
            <Skeleton className="h-4 w-120 m-4" />
            <Skeleton className="h-4 w-120 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-80 m-4" />
            <Skeleton className="h-4 w-120 m-4" />
            <Skeleton className="h-4 w-120 m-4" />
          </div>
        </Card>
      ) : (
        <ProfileForm data={data} productId={productId || 0}></ProfileForm>
      )}
    </div>
  );
}

export default page;
