import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { FormField, FormMessage } from "@/components/ui/form";
import { getTimeListForSchedule } from "@/utils/timezone";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { ScheduleFormSchema } from "./ScheduleForm";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const timeList = getTimeListForSchedule();

interface ScheduleFormDayProps {
  form: UseFormReturn<z.infer<typeof ScheduleFormSchema>>;
  dayIndex: number;
  dayAvailability: {
    start: string | undefined;
    end: string | undefined;
  }[];
}

export default function ScheduleFormDay({
  form,
  dayIndex,
  dayAvailability,
}: ScheduleFormDayProps) {
  const {
    fields: slotFields,
    append,
    remove,
  } = useFieldArray({
    name: `availability.${dayIndex}`,
    control: form.control,
  });
  // Determine if slots should be shown based on the passed availability data
  const [showSlots, setShowSlots] = React.useState(
    dayAvailability && dayAvailability.length > 0
  );

  // Update showSlots when the schedule data changes
  useEffect(() => {
    setShowSlots(dayAvailability && dayAvailability.length > 0);
  }, [dayAvailability]);

  const toggleShowSlots = () => {
    if (showSlots) {
      remove();
    } else {
      append({ start: "", end: "" });
    }
    setShowSlots(!showSlots);
  };

  const handleStartTimeChange = (value: string, index: number) => {
    form.setValue(`availability.${dayIndex}.${index}.start`, value);
  };

  const handleEndTimeChange = (value: string, index: number) => {
    form.setValue(`availability.${dayIndex}.${index}.end`, value);
  };

  return (
    <div
      key={`availability.${dayIndex}`}
      className="flex flex-col justify-start space-y-4 w-full min-h-12 lg:flex-row lg:space-x-8 lg:space-y-0"
    >
      <div className="flex space-x-2 w-[200px] items-center h-8">
        <Switch checked={showSlots} onCheckedChange={toggleShowSlots} />
        <Label htmlFor="day">{days[dayIndex]}</Label>
      </div>
      <div className="flex flex-col w-full">
        {showSlots && (
          <div className="flex flex-col space-y-2">
            {slotFields.map((slot, index) => (
              <div
                className="flex w-full"
                key={`availability.${dayIndex}.${slot.id}`}
              >
                <div className="flex justify-between  w-full lg:w-2/3">
                  <FormField
                    control={form.control}
                    name={`availability.${dayIndex}.${index}.start`}
                    render={({ field }) => (
                      <div className="flex flex-col w-full px-2">
                        <Combobox
                          name="Select..."
                          selectedValue={
                            field.value ? field.value.toString() : ""
                          }
                          onValueChange={(value) =>
                            handleStartTimeChange(value, index)
                          }
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
                      <div className="flex flex-col w-full px-2">
                        <Combobox
                          name="Select..."
                          selectedValue={
                            field.value ? field.value.toString() : ""
                          }
                          onValueChange={(value) =>
                            handleEndTimeChange(value, index)
                          }
                          options={timeList}
                        />
                        <FormMessage />
                      </div>
                    )}
                  />
                </div>
                {index === 0 ? (
                  <Button
                    variant="secondary"
                    size="icon"
                    type="button"
                    onClick={() => append({ start: "", end: "" })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="icon"
                    type="button"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
