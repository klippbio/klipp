"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import React from "react";

function Page() {
  const callAPI = async () => {
    const res = await axios.post("/api/calendar/createEvent", { name: "test" });
    const data = await res.data;
  };

  return (
    <div>
      <Card className="m-5 w-72">
        <div className="p-5 h-72">
          <h1 className="text-[#26282B font-bold text-foreground">Heading</h1>
          <p className="text-[#909090]">Content</p>
          <Button className="mt-5" onClick={callAPI}>
            Call API
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Page;
