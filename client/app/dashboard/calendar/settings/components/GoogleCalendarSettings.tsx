import { useAuthDetails } from "@/app/components/AuthContext";
import AxiosApi from "@/app/services/axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

interface GoogleCalendarSettingsProps {
  googleCalendar: {
    email: string;
  };
}

export default function GoogleCalendarSettings({
  googleCalendar,
}: GoogleCalendarSettingsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const authDetails = useAuthDetails();
  const message = useSearchParams().get("message");
  const connectedEmail = googleCalendar?.email;
  const queryClient = useQueryClient();

  const unlinkCalendarMutation = useMutation({
    mutationFn: async () => {
      const data = {
        storeId: authDetails.storeId,
      };
      const response = AxiosApi(
        "POST",
        "/api/calendar/unlinkCalendar",
        data,
        authDetails
      );
      return response;
    },
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast({
          title: "Successfully unlinked Google Calendar",
          description: "Your products wont be visible if no calendar is linked",
          variant: "default",
        });
      }

      // After successful unlink, invalidate the query in the parent component
      await queryClient.invalidateQueries([
        "calendarSettings",
        authDetails.storeId,
      ]);
    },
    onError: () => {
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
        router.replace("/dashboard/calendar/settings");
      } else if (message == "auth_failed") {
        toast({
          title: "Failed to link Google Calendar. Please try again",
          variant: "destructive",
        });
        router.replace("/dashboard/calendar/settings");
      }
    }
  }, [message, router, toast]);

  const generateGoogleOAuthUrl = (params: {
    access_type: string;
    scope: string[] | string;
    state?: string;
  }) => {
    const baseUrl = "https://accounts.google.com/o/oauth2/auth";
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID;
    const redirectUri =
      process.env.NEXT_PUBLIC_BACKEND_URL + "/calendar/linkCalendar"; // Change to your Express backend URL

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
      `&prompt=consent` +
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
          storeId: authDetails.storeId,
        }),
      });

      window.location.href = authUrl;
    } catch (error) {
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
                onClick={() => unlinkCalendarMutation.mutate()}
              >
                Unlink
              </Button>
              <div className="text-primary">{connectedEmail}</div>
            </div>
          ) : (
            <div className="flex items-center">
              <Button onClick={handleLinkCalendar}>Link</Button>
              <p className="text-[0.8rem] text-destructive ml-2">
                Users will not be able to view calendar products and book
                meeting if calendar is not connected
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
