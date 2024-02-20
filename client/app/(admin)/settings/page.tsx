"use client";
import React from "react";
import UserSettings from "./components/UserSettings";
import { useAuthDetails } from "@/app/components/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { store } from "@/app/(client)";
import axios, { AxiosError } from "axios";
import { Skeleton } from "@/components/ui/skeleton";

function Settings() {
  const authDetails = useAuthDetails();
  const username = authDetails?.storeUrl;

  const { data, isLoading } = useQuery<store, AxiosError>(
    ["settings", username],
    async () => {
      const response = await axios.get(`/api/publicuser/?username=${username}`);
      return response.data;
    },
    {
      enabled: !!username,
    }
  );

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ) : (
        <div>
          {" "}
          <div className="w-full">{data && <UserSettings data={data} />}</div>
        </div>
      )}
    </div>
  );
}

export default Settings;
