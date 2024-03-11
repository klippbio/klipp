import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ScheduleFormDay from "./ScheduleFormDay";

import AxiosApi from "@/app/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthDetails } from "@/app/components/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import BlockDatesForm from "./BlockDatesForm";
import {
  formatDateOverridesForUpdate,
  parseDateOverrides,
} from "@/utils/timezone";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import DeleteScheduleModal from "./DeleteScheduleModal";
import { Button, ButtonLoading } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PencilIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScheduleAvailabilityType } from "./Schedule";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/lib/utils";

export const ScheduleFormSchema = z.object({
  name: z.string().min(1, "Please enter a name"),
  availability: z
    .array(
      z.array(
        z
          .object({
            start: z.string().min(1, "Please select a start time"),
            end: z.string().min(1, "Please select an end time"),
          })
          .refine(
            (data) => {
              return new Date(data.start) < new Date(data.end);
            },
            {
              message: "End time must be greater than start time",
              path: ["end"],
            }
          )
      )
    )
    .length(7, "Availability must have exactly 7 days")
    .optional(),
  isDefault: z.boolean().optional(),
  dateOverrides: z.array(z.date()).optional(),
});

export default function ScheduleForm({
  authDetails,
}: {
  authDetails: AuthDetails;
}) {
  const searchParams = useSearchParams();

  const currentScheduleId = searchParams.get("scheduleId");

  const { data: schedule } = useQuery<ScheduleAvailabilityType>(
    ["schedule", currentScheduleId, authDetails?.storeId],
    async () =>
      await AxiosApi(
        "GET",
        `/api/calendar/get?scheduleId=${currentScheduleId}&storeId=${authDetails?.storeId}`
      ).then((res) => res.data),
    {
      enabled: !!currentScheduleId && !!authDetails?.storeId,
    }
  );

  const form = useForm<z.infer<typeof ScheduleFormSchema>>({
    resolver: zodResolver(ScheduleFormSchema),
    defaultValues: {
      name: "",
      availability: [],
      isDefault: false,
      dateOverrides: [],
    },
    mode: "all",
  });

  const router = useRouter();

  useEffect(() => {
    if (schedule) {
      form.reset({
        name: schedule.name,
        availability: schedule.availability,
        isDefault: schedule.isDefault,
        dateOverrides: parseDateOverrides(schedule.dateOverrides),
      });
    }
  }, [schedule, form]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editName, setEditName] = useState(false);
  const scheduleNameRef = useRef<HTMLInputElement>(null);

  const updateScheduleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof ScheduleFormSchema>) => {
      if (!schedule) {
        return Error("No schedule found");
      }
      const combinedData = {
        ...data,
        dateOverrides: formatDateOverridesForUpdate(data.dateOverrides),
        storeId: authDetails.storeId,
        scheduleId: schedule.id,
      };

      const response = await AxiosApi(
        "POST",
        `/api/calendar/update`,
        combinedData,
        authDetails
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "allSchedules",
        authDetails?.storeId,
      ]);
      toast({
        title: "Success!",
        duration: 1000,
        description: "Schedule Updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to create product",
      });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async () => {
      if (!schedule) {
        return Error("No schedule found");
      }
      const response = await AxiosApi(
        "DELETE",
        `/api/calendar/delete`,
        {
          storeId: authDetails.storeId,
          scheduleId: schedule.id,
        },
        authDetails
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "allSchedules",
        authDetails?.storeId,
      ]);
      toast({
        title: "Success!",
        duration: 1000,
        description: "Schedule Deleted.",
      });
      router.push("/dashboard/calendar/schedule");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: error.response?.data?.error,
      });
    },
  });

  function onSubmit(data: z.infer<typeof ScheduleFormSchema>) {
    updateScheduleMutation.mutate(data);
  }

  function onDelete() {
    deleteScheduleMutation.mutate();
  }

  return (
    <Card className="w-full">
      {Number(currentScheduleId) != Number(schedule?.id) ? (
        <div>
          <Skeleton className="h-6 w-1/2 m-4" />
          <Skeleton className="h-4 w-10/12 m-4" />
          <Skeleton className="h-4 w-10/12 m-4" />
          <Skeleton className="h-4 w-10/12 m-4" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex flex-col lg:flex-row text-foreground text-lg w-full space-y-2  h-full">
                <div className="pt-4 lg:order-1 order-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col lg:flex-row space-x-2 lg:items-center space-y-0">
                        <div
                          className="flex space-x-2"
                          onBlur={() => setEditName(false)}
                        >
                          <FormControl>
                            <Input
                              {...field}
                              ref={scheduleNameRef}
                              readOnly={!editName}
                              autoFocus={editName}
                              className="border-none shadow-none text-lg focus-visible:border-none focus-visible:shadow-none w-fit"
                              onClick={() => setEditName(true)}
                              onFocus={() => setEditName(true)}
                              onBlur={() => setEditName(false)}
                            />
                          </FormControl>
                          {!editName && (
                            <Button
                              type="button"
                              variant="ghost"
                              className="hover:bg-background hover:text-foreground ml-2"
                              onClick={() => {
                                setEditName(true);
                                if (scheduleNameRef.current) {
                                  scheduleNameRef.current.focus();
                                }
                              }}
                            >
                              <PencilIcon className="h-4 w-4 " />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="lg:order-2 order-1 flex justify-between space-x-2 lg:ml-auto h-full">
                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex">
                        <div className="flex space-x-2 items-center">
                          <div className="text-card-foreground text-sm">
                            Set to Default
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Separator
                      orientation="vertical"
                      className="hidden lg:block h-10"
                    />
                    <DeleteScheduleModal onDelete={onDelete} />
                    <Separator
                      orientation="vertical"
                      className="hidden lg:block h-10"
                    />
                    {updateScheduleMutation.isLoading ? (
                      <ButtonLoading />
                    ) : (
                      <Button type="submit">
                        <span>Save</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full">
              <div className="w-full space-y-4">
                {schedule?.availability.map((day, dayIndex) => (
                  <ScheduleFormDay
                    form={form}
                    dayIndex={dayIndex}
                    key={dayIndex}
                    dayAvailability={schedule?.availability[dayIndex]}
                  />
                ))}
                <BlockDatesForm form={form} />
              </div>
            </CardContent>
          </form>
        </Form>
      )}
    </Card>
  );
}
