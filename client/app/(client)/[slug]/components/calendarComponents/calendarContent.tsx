import Editor from "@/components/ui/custom/editor/Editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarDetails } from "@/app/(client)";
import { Label } from "@/components/ui/label";
import dayjs from "../../../../../utils/dayjs.index";
import { SaleFormData } from "../../[productId]/page";
import { TimezoneSelect } from "@/components/ui/timezoneSelect";
import SelectSlot from "./SelectSlot";

const calendarSaleFormData = z.object({
  name: z.string(),
  email: z.string().email(),
  timezone: z.string(),
  slot: z.string(),
});

export default function CalendarContent({
  itemDetails,
  handleSaleFormDataChange,
}: {
  itemDetails: CalendarDetails;
  handleSaleFormDataChange: (saleFormData: SaleFormData) => void;
}) {
  const initialBlocksData = JSON.parse(itemDetails.description)?.blocks;

  const form = useForm<z.infer<typeof calendarSaleFormData>>({
    resolver: zodResolver(calendarSaleFormData),
    mode: "onChange",
  });

  const [timezone, setTimezone] = useState<string>(dayjs.tz.guess());

  const [slot, setSlot] = useState<string>();
  if (timezone === "Asia/Calcutta") {
    setTimezone("Asia/Kolkata");
  }

  const handleSlotChange = (utcSlot: string) => {
    setSlot(utcSlot);
    form.setValue("slot", utcSlot);
  };

  const handleTimezoneChange = (selectedTimezone: string) => {
    form.setValue("timezone", selectedTimezone);
    setTimezone(selectedTimezone);
  };

  useEffect(() => {
    const subscription = form.watch((newValues) => {
      // Provide default values for properties that might be undefined
      const formData: SaleFormData = {
        name: newValues.name || "",
        email: newValues.email || "",
        timezone: timezone,
        slot: newValues.slot || "",
      };

      handleSaleFormDataChange(formData);
    });
    return () => subscription.unsubscribe();
  }, [form, handleSaleFormDataChange, timezone]);

  return (
    <div>
      <div className="text-secondary-foreground">
        <Editor
          initialBlocks={initialBlocksData}
          updateEditorData={initialBlocksData}
          isReadonly={true}
        ></Editor>
      </div>
      <Form {...form}>
        <form>
          <div className="flex flex-col gap-4 md:flex-nowrap flex-wrap">
            <div className="flex flex-col w-full">
              <div className="flex items-center w-full pb-2 pl-1">
                <Label className="mr-2">Timezone</Label>
              </div>
              <div className="w-full ">
                <TimezoneSelect
                  onTimeZoneChange={handleTimezoneChange}
                  selectedTimezone={timezone}
                />
              </div>
            </div>
            <SelectSlot
              timezone={timezone}
              storeItemId={itemDetails.storeItemId}
              onSlotSelect={handleSlotChange}
              selectedSlot={slot}
            />
            <div className="flex flex-row gap-4 md:flex-nowrap flex-wrap">
              <div className=" md:w-1/2 w-full ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <div className="flex flex-col w-full">
                        <div className="flex items-center w-full pb-2 pl-1">
                          <FormLabel htmlFor="name">Name</FormLabel>
                        </div>
                        <div className="w-full ">
                          <FormControl>
                            <Input {...field} name="name" id="name" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className=" md:w-1/2 w-full ">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <div className="flex flex-col w-full">
                        <div className="flex items-center w-full pb-2 pl-1">
                          <FormLabel className="w-1/6" htmlFor="email">
                            Email
                          </FormLabel>
                        </div>
                        <div className="w-full ">
                          <FormControl>
                            <Input {...field} name="email" id="email" />
                          </FormControl>
                          <FormMessage className="pl-1" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
