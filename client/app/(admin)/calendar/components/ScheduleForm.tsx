import React, { useEffect, useRef, useState } from "react";
import { MockSchedule } from "./Schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import ScheduleFormDay from "./ScheduleFormDay";
import { Input } from "@/components/ui/input";
import { PencilIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import AxiosApi from "@/app/services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthDetails } from "@/app/components/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import DeleteScheduleModal from "./DeleteScheduleModal";
import BlockDatesForm from "./BlockDatesForm";
import {
  formatDateOverridesForUpdate,
  parseDateOverrides,
} from "@/utils/timezone";
import { useRouter } from "next/navigation";

interface ScheduleFormProps {
  schedule: MockSchedule;
  authDetails: AuthDetails;
}

const ScheduleFormSchema = z.object({
  name: z.string().min(1, "Please enter a name"),
  availability: z
    .array(
      z.array(
        z.object({
          start: z.string().min(1, "Please select a start time"),
          end: z.string().min(1, "Please select an end time"),
        })
      )
    )
    .length(7)
    .optional(),
  isDefault: z.boolean().optional(),
  dateOverrides: z.array(z.date()).optional(),
});

export default function ScheduleForm({
  schedule,
  authDetails,
}: ScheduleFormProps) {
  const form = useForm<z.infer<typeof ScheduleFormSchema>>({
    resolver: zodResolver(ScheduleFormSchema),
    defaultValues: {
      name: schedule.name,
      availability: schedule.availability,
      isDefault: schedule.isDefault,
      dateOverrides: parseDateOverrides(schedule.dateOverrides),
    },
    mode: "all",
  });

  const router = useRouter();

  useEffect(() => {
    form.reset({
      name: schedule.name,
      availability: schedule.availability,
      isDefault: schedule.isDefault,
      dateOverrides: parseDateOverrides(schedule.dateOverrides),
    });
  }, [schedule, form]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editName, setEditName] = useState(false);
  const scheduleNameRef = useRef<HTMLInputElement>(null);

  const { fields: availabilityFields } = useFieldArray({
    name: "availability",
    control: form.control,
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof ScheduleFormSchema>) => {
      const combinedData = {
        ...data,
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
    onSuccess: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries(["allScehdules", authDetails?.storeId]);
      toast({
        title: "Success!",
        duration: 1000,
        description: "Schedule Deleted.",
      });
      router.push("/calendar/schedule");
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to delete schedule",
      });
    },
  });

  function onSubmit(data: z.infer<typeof ScheduleFormSchema>) {
    const updatedData = {
      ...data,
      dateOverrides: formatDateOverridesForUpdate(data.dateOverrides),
    };
    updateScheduleMutation.mutate(updatedData);
  }

  function onDelete() {
    deleteScheduleMutation.mutate();
  }
  return (
    <Card className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex flex-col lg:flex-row text-foreground text-lg w-full space-y-2 items-center">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex space-x-2 items-center space-y-0">
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
                            className="border-none shadow-none text-lg focus-visible:border-none focus-visible:shadow-none "
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
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-x-2 lg:ml-auto">
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
                <Separator orientation="vertical" />
                <DeleteScheduleModal onDelete={onDelete} />
                <Separator orientation="vertical" />
                <Button type="submit" className="w-16">
                  Save
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <div className="w-full space-y-4">
              {availabilityFields.map((day, dayIndex) => (
                <ScheduleFormDay
                  form={form}
                  day={day}
                  dayIndex={dayIndex}
                  key={dayIndex}
                />
              ))}
              <BlockDatesForm form={form} />
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
