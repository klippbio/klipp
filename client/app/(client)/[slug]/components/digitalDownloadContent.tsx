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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SaleFormData } from "../[productId]/page";

const bookingFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export default function DigitalDownloadContent({
  itemDetails,
  handleSaleFormDataChange,
}: {
  itemDetails: any; //eslint-disable-line
  handleSaleFormDataChange: (saleFormData: SaleFormData) => void;
}) {
  const initialBlocksData = JSON.parse(itemDetails.description)?.blocks;

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof bookingFormSchema>) {
    console.log(data);
  }

  // Watch form fields
  const watchedFields = form.watch();

  // Update parent component whenever form fields or slot change
  useEffect(() => {
    if (watchedFields.name && watchedFields.email) {
      handleSaleFormDataChange(watchedFields);
    }
  }, [watchedFields, handleSaleFormDataChange, form]);

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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">email</FormLabel>
                    <FormControl>
                      <Input {...field} name="email" type="email" id="emal" />
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
