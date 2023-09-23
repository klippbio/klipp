"use client";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/components/ui/utils";
import { Card } from "@/components/ui/card";

function page() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const handleLinkCalendar = async () => {
    try {
      // Send a request to your backend to initiate the OAuth flow
      setIsLoading(true);
      const response = await axios.get("/api/calendar");
      // Redirect the user to the Google OAuth consent page
      window.location.href = response.data.redirectUrl;
    } catch (error) {
      console.error("Error linking Google Calendar:", error);
    }
  };

  const handleOAuthCallback = async () => {
    if (searchParams.has("code") && searchParams.get("code") != null) {
      console.log("has code");
      const code = searchParams.get("code");
      console.log(code);
      if (code) {
        try {
          // Send the code to your backend for token exchange
          await axios.post("/api/calendar/2", { code });
          router.push("/dashboard");
        } catch (error) {
          console.error("Error exchanging code for tokens:", error);
          toast({
            title: "Error",
            description: "please try",
            variant: "destructive",
            duration: 3000,
            className: cn(
              "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
            ),
          });
        }
      }
    }
  };

  useEffect(() => {
    console.log("useEffect");
    handleOAuthCallback();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Card className="m-5 w-72 h-72">
          <Button className="m-5" onClick={handleLinkCalendar}>
            Link Google Calendar
          </Button>
        </Card>
      )}
    </div>
  );
}

export default page;
