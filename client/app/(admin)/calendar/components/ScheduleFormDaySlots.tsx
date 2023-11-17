import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { FormField, FormMessage } from "@/components/ui/form";
import { getTimeListForSchedule } from "@/utils/timezone";
import { Trash } from "lucide-react";
import React from "react";

interface ScheduleFormDaySlotsProps {
  form: any;
  day: any;
  dayIndex: number;
}

const timeList = getTimeListForSchedule();

export default function ScheduleFormDaySlots({
  form,
  day,
  dayIndex,
}: ScheduleFormDaySlotsProps) {
  return (
    <div className="flex flex-col w-full">
      {slotFields.map((slot, index) => (
        <div className="flex w-full space-x-4">
          <div className="flex w-full space-x-4 md:w-2/3">
            <FormField
              control={form.control}
              name={`availability.${dayIndex}.${index}.start`}
              render={({ field }) => (
                <div className="flex flex-col w-full ">
                  <Combobox
                    name="Slot Start Time"
                    selectedValue={field.value ? field.value.toString() : ""}
                    onValueChange={field.onChange}
                    options={timeList}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name={`availability.${dayIndex}.${index}.end`}
              render={({ field }) => (
                <div className="flex flex-col w-full ">
                  <Combobox
                    name="Slot Start Time"
                    selectedValue={field.value ? field.value.toString() : ""}
                    onValueChange={field.onChange}
                    options={timeList}
                  />
                  <FormMessage />
                </div>
              )}
            />
          </div>
          <Button
            variant="secondary"
            size="icon"
            type="button"
            onClick={() => remove(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
