import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { ScheduleFormSchema } from "./ScheduleForm";

export default function BlockDatesForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ScheduleFormSchema>>;
}) {
  form.watch("dateOverrides");
  const dateOverrides = form.watch("dateOverrides") ?? [];
  const currentBlockDates = dateOverrides.map((date) => {
    return new Date(date).toDateString();
  });
  currentBlockDates.sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex text-foreground text-lg w-full">
          Block Dates
        </CardTitle>
        <CardDescription>
          Add dates when you will be unavailable to take appointments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="dateOverrides"
          render={({ field }) => (
            <FormItem className="">
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline">Edit Blocked Dates</Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="multiple"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </FormItem>
          )}
        />
        <div className="pt-4 flex flex-col lg:flex-row space-x-2">
          {currentBlockDates.length > 0 && (
            <div className="flex flex-wrap ">
              {currentBlockDates.map((date) => (
                <div
                  key={date}
                  className="bg-background border border-border rounded-md text-xs px-2 py-1 ml-1 mb-1 min-w-[120px]"
                >
                  {date}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
