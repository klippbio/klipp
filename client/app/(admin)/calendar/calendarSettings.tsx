import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "@/utils/dayjs.index";
import { useQuery } from "@tanstack/react-query";
import { TimezoneSelect } from "@/components/ui/timezoneSelectOlf";

export default function CalendarSettings() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");

  console.log("this component is being rendered");

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
          title: "Failed to link Google Calendar",
          variant: "destructive",
        });
        router.replace("/calendar");
      }
    }
  }, [message]);
  const { toast } = useToast();

  const unlinkCalendar = async () => {
    try {
      const storeId = "7a61221a-1578-4cd4-a890-d594c92cc33c";
      const response = await axios.post("/api/calendar/unlinkCalendar", {
        storeId,
      });
      console.log("okay");
      console.log(response);

      if (response.status === 200) {
        toast({
          title: "Successfully unlinked Google Calendar",
          description: "Its is done really!",
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
    } catch (error: any) {
      console.error("Error unlinking Google Calendar:", error);
      toast({
        title: error.response.data
          ? error.response.data.error
          : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const generateGoogleOAuthUrl = (params: any) => {
    const baseUrl = "https://accounts.google.com/o/oauth2/auth";
    const clientId =
      "59264655502-4278olgkk28undr7ochka2npqodq27el.apps.googleusercontent.com";
    const redirectUri = "http://localhost:4000/calendar/linkCalendar"; // Change to your Express backend URL

    const scope = params.scope.join(" ");

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
        scope: ["https://www.googleapis.com/auth/calendar"],
        state: JSON.stringify({
          storeId: "7a61221a-1578-4cd4-a890-d594c92cc33c",
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

  const [selectedTimeZone, setSelectedTimeZone] = useState(dayjs.tz.guess());

  return (
    <div>
      <div>
        <TimezoneSelect
          onValueChange={setSelectedTimeZone}
          selectedTimeZone={selectedTimeZone}
        />
        <Button className="m-5" onClick={handleLinkCalendar}>
          Link Google Calendar
        </Button>
        <Button className="m-5" onClick={unlinkCalendar}>
          Unlink Google Calendar
        </Button>
      </div>
    </div>
  );
}
