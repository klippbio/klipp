"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export interface ComboboxProps {
  options: { value: string; label: string }[];
  name: string;
  selectedValue?: string | undefined;
  onValueChange: (value: string) => void;
}

export function Combobox({
  options,
  name,
  selectedValue,
  onValueChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const currentLabel = options.find((option) => option.value === selectedValue);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full"
          >
            {currentLabel?.label || name}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]">
          <Command>
            <CommandInput placeholder={name} />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup className="max-h-40  md:max-h-72 overflow-y-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  className={
                    option.value === selectedValue
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
