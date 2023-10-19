import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TimezoneSelect from "@/components/ui/timezoneSelect";
import { Combobox } from "@/components/ui/combobox";

const FormSchema = z.object({
  timezone: z.string({
    required_error: "Please select a timezone.",
  }),
  minimumBookingNotice: z.number({
    required_error: "Please enter a notice period.",
  }),
});

const minimumBookingNoticeOptions = [
  {
    value: 60,
    label: "1 hour",
  },
  {
    value: 120,
    label: "2 hour",
  },
  {
    value: 180,
    label: "3 hours",
  },
];

export function CalendarSettingsForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // ... (your other code)

  const handleTimeZoneChange = (selectedTimezone) => {
    // Handle the timezone change in this function
    form.setValue("timezone", selectedTimezone);
  };

  const handleMinimumBookingChange = (minimumBookingNotice) => {
    // Handle the timezone change in this function
    form.setValue("minimumBookingNotice", minimumBookingNotice);
    console.log(minimumBookingNotice);
  };

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <div className="flex flex-col">
              <FormLabel>Timezone</FormLabel>
              <TimezoneSelect
                onTimeZoneChange={handleTimeZoneChange}
                selectedTimezone={field.value}
              />
              <FormMessage />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="minimumBookingNotice"
          render={({ field }) => (
            <div className="flex flex-col w-[300px]">
              <FormLabel>Notice Period</FormLabel>
              <Combobox
                name="Minimum Notice"
                selectedValue={field.value}
                onValueChange={handleMinimumBookingChange}
                options={minimumBookingNoticeOptions}
              />
              <FormMessage />
            </div>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
