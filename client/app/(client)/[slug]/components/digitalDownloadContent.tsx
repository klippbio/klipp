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
  // flexPrice: z.string(),
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

  // function onSubmit(data: z.infer<typeof bookingFormSchema>) {
  //   console.log(data);
  // }

  // // Watch form fields
  // const watchedFields = form.watch();

  // // Update parent component whenever form fields or slot change
  // useEffect(() => {
  //   handleSaleFormDataChange(watchedFields);
  // }, [watchedFields, handleSaleFormDataChange, form]);

  useEffect(() => {
    const subscription = form.watch((newValues) => {
      // Provide default values for properties that might be undefined
      const formData: SaleFormData = {
        name: newValues.name || "",
        email: newValues.email || "",
        // flexPrice: newValues.flexPrice || "",
      };

      handleSaleFormDataChange(formData);
    });
    return () => subscription.unsubscribe();
  }, [form, handleSaleFormDataChange]);

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
            <div className="w-full flex-none md:flex gap-4">
              <div className=" w-full">
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
              <div className=" w-full">
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
            {/* <div className="w-full">
              <FormField
                control={form.control}
                name="flexPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Price</FormLabel>
                    <FormControl>
                      <Input {...field} name="flexPrice" id="flexPrice" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
          </div>
        </form>
      </Form>
    </div>
  );
}
