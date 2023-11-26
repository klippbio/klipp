import { useAuthDetails } from "@/app/components/AuthContext";
import AxiosApi from "@/app/services/axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { allSchedulesResponse } from "../../schedule/components/Schedule";

import CalendarProductAvailabilityCard from "./CalendarProductAvailabilityCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function CalendarProductSelect({
  currentScheduleId,
  productId,
}: {
  currentScheduleId: string;
  productId: number;
}) {
  const authDetails = useAuthDetails();
  const { toast } = useToast();
  const router = useRouter();

  const [scheduleId, setScheduleId] = useState(String(currentScheduleId));
  const queryClient = useQueryClient();

  const { data: response } = useQuery<allSchedulesResponse>(
    ["allSchedules", authDetails?.storeId],
    async () =>
      await AxiosApi(
        "GET",
        `/api/calendar/getAll/?storeId=${authDetails?.storeId}`
      ).then((res) => res.data),
    {
      enabled: !!authDetails?.storeId,
    }
  );
  const allSchedules = response?.schedules;

  const editSchedule = z.object({
    scheduleId: z.string({
      required_error: "Please select an email to display.",
    }),
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof editSchedule>) => {
      const combinedData = {
        ...data,
        storeId: authDetails.storeId,
        calendarProductId: productId,
      };
      const response = await AxiosApi(
        "POST",
        "/api/calendar-products/schedule",
        combinedData,
        authDetails
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["product", productId]);
      toast({
        title: "Success!",
        duration: 1000,
        description: "Schedule Updated !",
      });
      router.push(
        "/calendar/products/edit?id=" + productId + "&tab=availability"
      );
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to update schedule",
      });
    },
  });
  const form = useForm<z.infer<typeof editSchedule>>({
    defaultValues: {
      scheduleId: currentScheduleId,
    },
    resolver: zodResolver(editSchedule),
    mode: "all",
  });

  const onSubmit = (data: z.infer<typeof editSchedule>) => {
    mutation.mutate(data);
  };

  return (
    <Card className="my-4 lg:w-2/3">
      <CardHeader className="">
        <CardTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" flex font-semibold justify-between"
            >
              <div className="flex flex-col space-y-2">
                <div className="text-foreground">Availability</div>
                <div>
                  <FormField
                    control={form.control}
                    name="scheduleId"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          key={scheduleId}
                          defaultValue={String(scheduleId)}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setScheduleId(value);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {allSchedules &&
                                allSchedules.map((schedule) => (
                                  // Use the combination of ID and name as the value, but only display the name
                                  <SelectItem
                                    value={String(schedule.id)}
                                    key={schedule.id}
                                  >
                                    {schedule.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </CardTitle>
      </CardHeader>
      <CalendarProductAvailabilityCard scheduleId={scheduleId} />
    </Card>
  );
}
