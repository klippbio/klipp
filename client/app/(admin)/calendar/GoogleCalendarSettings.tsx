import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Calendar, Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { FormDescription } from "@/components/ui/form";

interface GoogleCalendarSettingsProps {
  storeId: string;
  googleCalendar: {
    email: string;
  };
}

export default function GoogleCalendarSettings({
  googleCalendar,
  storeId,
}: GoogleCalendarSettingsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const message = useSearchParams().get("message");
  const connectedEmail = googleCalendar?.email;
  const queryClient = useQueryClient();

  const unlinkCalendarMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/calendar/unlinkCalendar", {
        storeId,
      });
      return response;
    },
    onSuccess: (response) => {
      console.log("okay");
      console.log(response);

      if (response.status === 200) {
        toast({
          title: "Successfully unlinked Google Calendar",
          description: "It is done really!",
          variant: "default",
        });
      } else {
        const errorResponse = response;
        toast({
          title: errorResponse.error,
          description: "nope",
          variant: "destructive",
        });
      }

      // After successful unlink, invalidate the query in the parent component
      queryClient.invalidateQueries(["calendarSettings", storeId]);
    },
    onError: (error: AxiosError) => {
      console.error("Error unlinking Google Calendar:", error);
      toast({
        title: "Internal server error",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (message) {
      if (message == "auth_success") {
        toast({
          title: "Successfully linked Google Calendar",
          variant: "default",
        });
        router.replace("/calendar");
      } else if (message == "auth_failed") {
        toast({
          title: "Failed to link Google Calendar. Please try again",
          variant: "destructive",
        });
        router.replace("/calendar");
      }
    }
  }, [message]);

  const generateGoogleOAuthUrl = (params: any) => {
    const baseUrl = "https://accounts.google.com/o/oauth2/auth";
    const clientId =
      "59264655502-qodhgr9q58u4724rvrr0i2ums83olras.apps.googleusercontent.com";
    const redirectUri = "http://localhost:4000/calendar/linkCalendar"; // Change to your Express backend URL

    // Ensure params.scope is an array and join the scopes with a space
    const scope = Array.isArray(params.scope)
      ? params.scope.join(" ")
      : params.scope;

    const url =
      `${baseUrl}?` +
      `client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=${scope}` +
      `&access_type=${params.access_type || "offline"}` +
      `&state=${params.state || ""}` +
      `&response_type=code`;

    return url;
  };

  const handleLinkCalendar = async () => {
    try {
      const authUrl = generateGoogleOAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/calendar",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
        state: JSON.stringify({
          storeId: storeId,
        }),
      });

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error linking Google Calendar:", error);
      toast({
        title: "Error linking Google Calendar",
        description: "nope",
      });
    }
  };

  return (
    <div className="flex flex-col w-full items-center md:flex-row">
      <div className="flex flex-col w-full md:flex-row md:items-center">
        <div className="flex items-center w-full pb-2 md:w-1/3 md:items-start">
          <Calendar size={18} className="mr-2" />
          <p className="md:mr-2 whitespace-nowrap">Google Calendar</p>
        </div>
        <div className="w-full md:w-2/3">
          {connectedEmail ? (
            <div className="flex items-center">
              <Button
                className="mr-2"
                onClick={async () => {
                  await unlinkCalendarMutation.mutate();
                  console.log("Unlink button clicked");
                  // queryClient.invalidateQueries(["calendarSettings", storeId]);
                }}
              >
                Unlink
              </Button>
              <div className="text-primary">{connectedEmail}</div>
            </div>
          ) : (
            <div className="flex items-center">
              <Button onClick={handleLinkCalendar}>Link</Button>
              <p className="text-[0.8rem] text-destructive ml-2">
                Users will not be able to book meeting if calendar is not
                connected
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
