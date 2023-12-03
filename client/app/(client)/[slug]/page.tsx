"use client";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import UsernameNotfound from "./components/UsernameNotfound";
import { store, storeItem } from "..";

function Mypage() {
  const router = useRouter();
  const username = usePathname().substring(1);

  const { data, isLoading, error } = useQuery<store, AxiosError>(
    ["allProducts", username],
    async () => {
      const response = await axios.get(`/api/publicuser/?username=${username}`);
      return response.data;
    },
    {
      enabled: true,
    }
  );

  if (error?.response?.status === 404) {
    return <UsernameNotfound username={username} />;
  }

  if (error?.response?.status === 500) {
    throw Error("Internal Server Error");
  }

  return (
    <div>
      {isLoading ? <div>Loading...</div> : <div></div>}
      <div className="md:flex md:flex-row m-4 gap-4 flex-wrap">
        {data &&
          data.storeItems.map((item: storeItem) => (
            <Card
              onClick={() => {
                router.push(`/${username}/${item.id}`);
              }}
              className="md:w-1/3 w-full h-32 mb-4 cursor-pointer"
              key={item.id}
            >
              <div className="p-6">
                <div className="text-xl justify-center font-bold text-bold text-secondary-foreground">
                  <div className="flex flex-row justify-between">{item.id}</div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default Mypage;
