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
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bookingFormSchema = z.object({
  name: z.string(),
  price: z.string(),
});

export default function DigitalDownloadContent({
  itemDetails,
}: {
  itemDetails: any; //eslint-disable-line
}) {
  const initialBlocksData = JSON.parse(itemDetails.description)?.blocks;

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof bookingFormSchema>) {
    console.log(data);
  }
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-row gap-4 md:flex-nowrap flex-wrap">
            <div className=" md:w-1/2 w-full ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input {...field} name="name" id="name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" md:w-1/2 w-full">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">email</FormLabel>
                    <FormControl>
                      <Input {...field} name="name" type="number" id="name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
