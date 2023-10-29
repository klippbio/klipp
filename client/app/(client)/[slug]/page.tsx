"use client";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { url } from "inspector";
import { Badge } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

function Mypage() {
  const router = useRouter();
  const userName = usePathname().substring(1);

  const { data, isLoading } = useQuery(
    ["allProducts", userName],
    async () => {
      const response = await axios.get(`/api/publicuser/?username=${userName}`);
      return response.data;
    },
    {
      enabled: true,
    }
  );

  return (
    <div>
      {isLoading ? <div>Loading...</div> : <div></div>}

      <div className="md:flex md:flex-row m-4 gap-4 flex-wrap">
        {data &&
          data.storeItems.map((item: any) => (
            <Card
              onClick={() => {
                router.push(`/${userName}/${item.id}`);
              }}
              className="md:w-1/3 w-full h-32 mb-4 cursor-pointer"
              key={item.id}
            >
              <div className="p-6">
                <div className="text-xl justify-center font-bold text-bold text-secondary-foreground">
                  <div className="flex flex-row justify-between">
                    <div>{item.DigitalProduct.name}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default Mypage;
