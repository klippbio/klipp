import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { FormField, FormMessage } from "@/components/ui/form";
import { getTimeListForSchedule } from "@/utils/timezone";
import { Label } from "@/components/ui/label";
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const timeList = getTimeListForSchedule();
export default function ScheduleFormDay({ form, day, dayIndex }) {
  const {
    fields: slotFields,
    append,
    remove,
  } = useFieldArray({
    name: `availability.[${dayIndex}]`,
    control: form.control,
  });

  const [showSlots, setShowSlots] = React.useState(slotFields.length > 0);

  useEffect(() => {
    if (showSlots && slotFields.length === 0) {
      append({ start: "", end: "" });
    } else if (!showSlots && slotFields.length > 0) {
      remove();
    }
  }, [showSlots]);

  return (
    <div
      key={day.id}
      className="flex flex-col justify-start space-y-4 w-full min-h-12 lg:flex-row lg:space-x-8 lg:space-y-0"
    >
      <div className="flex space-x-2 w-[200px] items-center h-8">
        <Switch checked={showSlots} onCheckedChange={setShowSlots} />
        <Label htmlFor="day">{days[dayIndex]}</Label>
      </div>
      <div className="flex flex-col w-full">
        {showSlots && (
          <div className="flex flex-col space-y-2">
            {slotFields.map((slot, index) => (
              <div className="flex w-full" key={index}>
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
                      <div className="flex flex-col w-full px-2">
                        <Combobox
                          name="Select..."
                          selectedValue={
                            field.value ? field.value.toString() : ""
                          }
                          onValueChange={field.onChange}
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
                    onClick={() => remove(index)}
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
