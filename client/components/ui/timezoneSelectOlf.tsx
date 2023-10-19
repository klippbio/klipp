import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useTimezoneSelect } from "react-timezone-select";
import {
  addCitiesToDropdown,
  filterByCities,
  handleOptionLabel,
} from "@/utils/timezone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import dayjs from "dayjs";

export interface ICity {
  city: string;
  timezone: string;
}

export interface TimezoneSelectProps {
  selectedTimeZone: string;
  onValueChange?: (value: string) => void;
}

export function TimezoneSelect(props: TimezoneSelectProps) {
  const { selectedTimeZone, value } = props;
  const [cities, setCities] = useState<ICity[]>([]);
  const { data, isLoading } = useQuery({
    queryKey: ["cityTimezones"],
    queryFn: () =>
      axios.get("/api/calendar/cityTimezones").then((res) => res.data),
  });

  // const handleInputChange = (tz: string) => {
  //   console.log(tz);
  //   console.log("Called");
  //   if (data) setCities(filterByCities(tz, data));
  //   return;
  // };

  const labelStyle = "original";
  const timezones = {
    ...(data ? addCitiesToDropdown(data) : {}),
  };
  console.log(timezones);

  const { options } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  return (
    <Select disabled={isLoading} value={selectedTimeZone}>
      <SelectTrigger>
        <SelectValue placeholder="Select Timezone" />
      </SelectTrigger>
      <SelectContent className="overflow-y-auto max-h-[10rem]">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {handleOptionLabel(option, cities)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
