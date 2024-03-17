import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, ButtonLoading } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { CalendarClock, MapPinIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { TimezoneSelect } from "@/components/ui/timezoneSelect";
import AxiosApi from "@/app/services/axios";
import { useAuthDetails } from "@/app/components/AuthContext";

const FormSchema = z.object({
  timeZone: z.string({
    required_error: "Please select a timezone.",
  }),
  minimumBookingNotice: z.number({
    required_error: "Please enter a notice period.",
  }),
});

const minimumBookingNoticeOptions = [
  {
    value: 120,
    label: "2 hours",
  },
  {
    value: 180,
    label: "3 hours",
  },
  {
    value: 240,
    label: "4 hours",
  },
  {
    value: 360,
    label: "6 hours",
  },
  {
    value: 720,
    label: "12 hours",
  },
  {
    value: 1440,
    label: "24 hours",
  },
];
export const ZUpdateCalendarSettingSchema = z.object({
  minimumBookingNotice: z.number().int(),
  timeZone: z.string(),
});

interface EventSettingsFormProps {
  timeZone: string;
  minimumBookingNotice: number;
}

export function EventSettingsForm({
  timeZone,
  minimumBookingNotice,
}: EventSettingsFormProps) {
  const { toast } = useToast();
  const authDetails = useAuthDetails();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      timeZone: timeZone,
      minimumBookingNotice: minimumBookingNotice,
    },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ZUpdateCalendarSettingSchema>) => {
      const combinedData = {
        ...data,
        storeId: authDetails.storeId,
      };
      const result = await AxiosApi(
        "POST",
        "/api/calendar/settings",
        combinedData,
        authDetails
      );
      return result.data;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        duration: 3000,
        description: "Calendar Settings Updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 3000,
        description: "Calendar Settings Update Failed. Try Again",
      });
    },
  });

  const handleTimeZoneChange = (
    selectedTimezone: EventSettingsFormProps["timeZone"]
  ) => {
    // Handle the timeZone change in this function
    form.setValue("timeZone", selectedTimezone);
  };

  const handleMinimumBookingChange = (minimumBookingNotice: string) => {
    // Handle the timeZone change in this function
    form.setValue("minimumBookingNotice", parseInt(minimumBookingNotice));
  };

  function onSubmit(data: z.infer<typeof ZUpdateCalendarSettingSchema>) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full flex flex-col"
      >
        <FormField
          control={form.control}
          name="timeZone"
          render={({ field }) => (
            <div className="flex flex-col">
              <div className="flex flex-col w-full items-start md:flex-row">
                <div className="flex items-center w-full pb-2 md:w-1/3">
                  <MapPinIcon size={20} className="mr-2" />
                  <FormLabel className="mr-2">Timezone</FormLabel>
                </div>
                <div className="w-full md:w-2/3">
                  <TimezoneSelect
                    onTimeZoneChange={handleTimeZoneChange}
                    selectedTimezone={field.value}
                  />
                  <FormDescription className="ml-2">
                    This is the timezone in which your events will be scheduled.
                  </FormDescription>
                </div>
              </div>

              <FormMessage />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="minimumBookingNotice"
          render={({ field }) => (
            <div className="flex flex-col">
              <div className="flex flex-col w-full items-start md:flex-row">
                <div className="flex items-center w-full pb-2 md:w-1/3">
                  <CalendarClock size={20} className="mr-2" />
                  <FormLabel className="mr-2">Notice Period</FormLabel>
                </div>
                <div className="w-full md:w-2/3">
                  <Combobox
                    name="Minimum Notice"
                    selectedValue={field.value ? field.value.toString() : ""}
                    onValueChange={handleMinimumBookingChange}
                    options={minimumBookingNoticeOptions.map((option) => ({
                      ...option,
                      value: option.value.toString(),
                    }))}
                  />
                  <FormDescription className="ml-2">
                    Set the minimum amount of notice you need before the start
                    of your event to prevent last-minute bookings
                  </FormDescription>
                </div>
              </div>
              <FormMessage />
            </div>
          )}
        />

        {mutation.isLoading ? (
          <ButtonLoading />
        ) : (
          <Button type="submit">
            <span>Save</span>
          </Button>
        )}
      </form>
    </Form>
  );
}
