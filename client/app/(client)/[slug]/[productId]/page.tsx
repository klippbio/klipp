"use client";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { url } from "inspector";
import { Badge } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

function publicProductPage() {
  const id = usePathname().split("/").pop();
  console.log(id);

  const { data, isLoading } = useQuery(["product", id], async () => {
    const response = await axios.get(`/api/product/?id=${id}`);
    return response.data;
  });

  return (
    <div>
      {isLoading ? <div>Loading...</div> : <div></div>}

      <div className="md:flex md:flex-row m-4 gap-4 flex-wrap">
        {data && (
          <Card className="md:w-1/3 w-full h-32 mb-4" key={data.id}>
            <div className="p-6">
              <div className="text-xl justify-center font-bold text-bold text-secondary-foreground">
                <div className="flex flex-row justify-between">
                  <div>{data.DigitalProduct.name}</div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default publicProductPage;
