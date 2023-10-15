"use client";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/components/ui/utils";
import { Card } from "@/components/ui/card";
import { set } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarSettings from "./calendarSettings";

function Page() {
  const { toast } = useToast();
  return (
    <div>
      <Tabs defaultValue="settings" className="w-full p-3">
        <TabsList className="justify-start">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <div>Products</div>
        </TabsContent>
        <TabsContent value="schedule">
          <Card className="w-1/3 h-72 p-5">
            <div className="text-foreground">Heading</div>
            This is the body text
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <CalendarSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Page;
