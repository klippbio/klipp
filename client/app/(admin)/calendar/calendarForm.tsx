import React, { useState, useMemo, useEffect, use } from "react";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  filterByCities,
  handleOptionLabel,
  addCitiesToDropdown,
} from "@/utils/timezone";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/components/ui/utils";
import { useTimezoneSelect } from "react-timezone-select";
import type { ITimezoneOption } from "react-timezone-select";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import dayjs from "@/utils/dayjs.index";

const FormSchema = z.object({
  timezone: z.string({
    required_error: "Please select a timezone.",
  }),
});

export interface ICity {
  city: string;
  timezone: string;
}

export function ComboboxForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [open, setOpen] = React.useState(false);
  const [cities, setCities] = useState<ICity[]>([]);
  const [timezones, setTimezones] = useState<{}>([]);
  const [options, setOptions] = useState<TimezoneInfo[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["cityTimezones"],
    queryFn: () =>
      axios.get("/api/calendar/cityTimezones").then((res) => res.data),
  });

  useEffect(() => {
    if (data) {
      setTimezones(addCitiesToDropdown(data));
    }
  }, [data]);

  useEffect(() => {
    const updatedOptions = convertTimezones(timezones);
    setOptions(updatedOptions);
    console.log(updatedOptions);
  }, [timezones]);

  useEffect(() => {
    console.log("options changed");
  }, [options]);

  const updateTimezones = (currentTz: {}, pastTimezones: {}) => {
    const updatedTimezones = { ...pastTimezones, ...currentTz };
    setTimezones(updatedTimezones);
  };

  function onSubmit(data) {
    console.log(data);
  }

  const handleInputChange = (tz: string) => {
    if (data) {
      setCities(filterByCities(tz, data));
      updateTimezones(addCitiesToDropdown(cities), timezones);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <div className="flex flex-col">
              <FormLabel>Timezone</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-1/2 justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? data.find(
                            (timezone) => timezone.timezone === field.value
                          ).timezone
                        : "Select city"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command onChange={(e) => handleInputChange(e.target.value)}>
                    <CommandInput placeholder="Search timezone..." />
                    <CommandEmpty>No timezone found.</CommandEmpty>
                    <CommandGroup className="h-72 overflow-y-auto">
                      {options.map((option) => (
                        <CommandItem
                          onSelect={() => {
                            form.setValue("timezone", option.value);
                            setOpen(false); // Use the value of the selected option
                          }}
                        >
                          {handleOptionLabel(option as ITimezoneOption, cities)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </div>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function convertTimezones(input: Record<string, string>): TimezoneInfo[] {
  const timezonesArray = Object.entries(input).map(([key, value]) => {
    const now = dayjs().tz(key);
    const offsetMinutes = now.utcOffset();
    const offsetHours = Math.floor(offsetMinutes / 60);
    const offsetMinutesRemainder = offsetMinutes % 60;
    const offsetString =
      (offsetHours >= 0 ? "+" : "-") +
      Math.abs(offsetHours).toString().padStart(2, "0") +
      ":" +
      Math.abs(offsetMinutesRemainder).toString().padStart(2, "0");
    const label = `(GMT${offsetString}) ${value}`;

    return {
      value: key,
      label: label,
      offset: offsetHours + offsetMinutesRemainder / 60,
      abbrev: now.format("z"),
      altName: value,
    };
  });

  return timezonesArray;
}
type TimezoneInfo = {
  value: string;
  label: string;
  offset: number;
  abbrev: string;
  altName: string;
};
