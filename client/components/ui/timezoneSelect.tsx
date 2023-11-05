// TimezoneSelect.js
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  addCitiesToDropdown,
  filterByCities,
  handleOptionLabel,
} from "@/utils/timezone";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { ChevronsUpDown } from "lucide-react";
import dayjs from "@/utils/dayjs.index";
import { Skeleton } from "./skeleton";
import AxiosApi from "@/app/services/axios";

interface TimezoneSelectProps {
  onTimeZoneChange: (timezone: string) => void;
  selectedTimezone: string;
}

export function TimezoneSelect({
  onTimeZoneChange,
  selectedTimezone,
}: TimezoneSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [cities, setCities] = useState<ICity[]>([]);
  const [timezones, setTimezones] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<TimezoneInfo[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["cityTimezones"],
    queryFn: async () =>
      await AxiosApi("GET", `/api/calendar/cityTimezones`).then(
        (res) => res.data
      ),
  });

  useEffect(() => {
    if (data) {
      setTimezones(addCitiesToDropdown(data));
    }
  }, [data]);

  useEffect(() => {
    const updatedOptions = convertTimezones(timezones);
    setOptions(updatedOptions);
  }, [timezones]);

  const updateTimezones = (
    currentTz: Record<string, string>,
    pastTimezones: Record<string, string>
  ) => {
    const updatedTimezones = { ...pastTimezones, ...currentTz };
    setTimezones(updatedTimezones);
  };
  const handleInputChange = (tz: string) => {
    if (data) {
      setCities(filterByCities(tz, data));
      updateTimezones(addCitiesToDropdown(cities), timezones);
    }
  };
  return isLoading ? (
    <Skeleton className="h-6 w-40 m-4" />
  ) : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !selectedTimezone && "text-muted-foreground"
          )}
        >
          {selectedTimezone && data
            ? data.find(
                (timezone: ICity) => timezone.timezone === selectedTimezone
              ).timezone
            : "Select city"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e.target.value)
          }
        >
          <CommandInput placeholder="Search timezone..." />
          <CommandEmpty>No timezone found.</CommandEmpty>
          <CommandGroup className="h-72 overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                onSelect={() => {
                  onTimeZoneChange(option.value);
                  setOpen(false); // Use the value of the selected option
                }}
                key={option.label}
              >
                {handleOptionLabel(option, cities)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function convertTimezones(
  input: Record<string, string>
): TimezoneInfo[] {
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
export interface TimezoneInfo {
  value: string;
  label: string;
  offset: number;
  abbrev: string;
  altName: string;
}
export interface ICity {
  city: string;
  timezone: string;
}
