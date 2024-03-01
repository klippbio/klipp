import React from "react";
import TopBar from "../components/topBar";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

function page() {
  return (
    <div className="h-screen relative">
      <div className="sticky top-0 z-50 bg-background ">
        <TopBar pageTitle="Home" className="mx-4 md:mx-8" />
        <Separator className="mt-4" orientation="horizontal" />
      </div>
      <div className="mx-4 md:mx-8 mt-4 overflow-auto pb-20 md:pb-0">
        <div>
          <Card className="w-72">
            <div className="p-5 h-72">
              <h1 className="text-[#26282B font-bold text-foreground">
                Heading
              </h1>
              <p className="text-[#909090]">Content</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default page;
