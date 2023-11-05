"use client";
import { Card } from "@/components/ui/card";
import React from "react";

function Page() {
  return (
    <div>
      <Card className="m-5 w-72">
        <div className="p-5 h-72">
          <h1 className="text-[#26282B font-bold text-foreground">Heading</h1>
          <p className="text-[#909090]">Content</p>
        </div>
      </Card>
    </div>
  );
}

export default Page;
