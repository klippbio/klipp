//TODO: Rename files in Bucket with storename + salt
//TODO: Add file limits
//TODO: Add file type validation
//TODO: Add file size validation
//TODO: Sapertate folders for all different file types
//TODO: Fix StoreId issue
//TODO: Add Auth to API routes
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { generateUploadURL, uploadFile } from "@/app/services/getS3url";
import Editor from "@/components/ui/custom/editor/Editor";
import { Loader2, Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PrefixInputRight } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import AxiosApi from "@/app/services/axios";
import { useAuthDetails } from "@/app/components/AuthContext";
import { CalendarProductApiResponse, ErrorResponse } from "@/types/apiResponse";
import Image from "next/image";
import { AxiosError } from "axios";

//types
export const calendarProductSchema = z
  .object({
    title: z.string(),
    thumbnailUrl: z.string().optional(),
    shortDescription: z.string().optional(),
    description: z.any().optional(),
    length: z.string().min(1, { message: "Please enter duration " }),
    visibility: z.boolean().optional().default(false),
    timeZone: z.string().optional(),
    price: z.string().default("0"),
    recPrice: z.string().optional(),
    minPrice: z.string().optional(),
    flexPrice: z.boolean().optional(),
    currency: z.array(z.string()).optional().default(["USD"]),
    periodType: z.string().optional(),
    periodStartDate: z.date().optional(),
    periodEndDate: z.date().optional(),
    minimumBookingNotice: z.number().optional(),
    beforeEventBuffer: z.number().optional(),
    afterEventBuffer: z.number().optional(),
  })
  .refine(
    (data) => {
      if (
        data.recPrice !== undefined &&
        data.recPrice !== "" &&
        data.price !== undefined &&
        data.price !== "" &&
        data.flexPrice == true
      ) {
        return Number(data.price) <= Number(data.recPrice);
      }
      return true;
    },
    {
      message: "Recommended price must be greater than price",
      path: ["recPrice"],
    }
  );

type AccountFormValues = z.infer<typeof calendarProductSchema>;

export function CalendarProductEdit({
  data,
  productId,
}: {
  data: CalendarProductApiResponse;
  productId: number;
}) {
  //consts
  const authDetails = useAuthDetails();
  const [selectedFile, setSelectedFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editorData, setEditorData] = useState("");
  // const [flexPrice, setFlexPrice] = useState(true);
  // const [minPrice, setMinPrice] = useState("0");
  const [initialBlocksData, setInitialBlocksData] = useState([]);
  const { toast } = useToast();
  const router = useRouter();
  //eslint-disable-next-line
  const updateEditorData = useCallback((state: any) => {
    setEditorData(state);
  }, []);
  const productData = data;

  const defaultValues: Partial<AccountFormValues> = {
    title: productData.title || "",
    shortDescription: productData.shortDescription || "",
    currency: productData.currency || "USD",
    price: productData.price || "",
    recPrice: productData.recPrice || "",
    minPrice: productData.minPrice || "",
    flexPrice: productData.flexPrice || false,
    visibility: productData.visibility,
    length: String(productData.length),
  };

  const form = useForm<z.infer<typeof calendarProductSchema>>({
    defaultValues: defaultValues,
    resolver: zodResolver(calendarProductSchema),
    mode: "all",
  });

  // const { watch } = form;

  //effects
  useEffect(() => {
    if (productData.thumbnailUrl) {
      setSelectedFile(productData.thumbnailUrl);
      setImageUrl(productData.thumbnailUrl);
    }
    // if (productData.flexPrice) {
    //   setFlexPrice(false);
    // }
    if (productData.description) {
      const parsedDescription = JSON.parse(productData.description);
      setEditorData(parsedDescription);
      setInitialBlocksData(parsedDescription.blocks);
    }
  }, [
    productData.description,
    productData.flexPrice,
    productData.thumbnailUrl,
  ]);
  // const price = watch("price");

  // useEffect(() => {
  //   setMinPrice(price);
  // }, [price, form]);

  //functions
  function onSubmit(data: z.infer<typeof calendarProductSchema>) {
    data.thumbnailUrl = imageUrl;
    data.description = editorData;

    mutation.mutate(data);
  }

  async function getUploadURL() {
    return await generateUploadURL();
  }

  async function onThumbnailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const uploadUrl = await getUploadURL();
    const imageUrl = await uploadFile(uploadUrl, file);
    setSelectedFile(imageUrl);
    setImageUrl(imageUrl);
  }

  //mutations
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof calendarProductSchema>) => {
      const combinedData = {
        ...data,
        storeId: authDetails.storeId,
        length: parseInt(data.length),
        id: productId,
      };
      const response = await AxiosApi(
        "POST",
        "/api/calendar-products/update",
        combinedData,
        authDetails
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        duration: 1000,
        description: "Product Created.",
      });
      router.push("/dashboard/calendar/products");
    },
    onError: async (error: AxiosError<ErrorResponse>) => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: error.response?.data?.error || "Failed to create product!",
      });
    },
  });

  return (
    <Card className="my-4 lg:w-2/3">
      <CardHeader>
        <CardTitle className="text-foreground text-lg">
          Calendar Product
        </CardTitle>
        <CardDescription>
          Enter details about your calendar product
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="">
          <div className="p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-5"
              >
                <div className="flex md:flex-row flex-col md:space-x-5  ">
                  <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={() => (
                      <FormItem className="md:h-56">
                        <FormLabel htmlFor="thumbnail">Thumbnail</FormLabel>
                        <FormControl>
                          <div
                            className={`w-full h-full md:w-64 border-2 flex flex-col items-center justify-center rounded-md relative ${
                              selectedFile
                                ? "border-transparent"
                                : buttonVariants({ variant: "ghost" })
                            }`}
                          >
                            {selectedFile ? (
                              <Image
                                src={selectedFile}
                                alt="Thumbnail"
                                width={1000}
                                height={1000}
                                className="w-full h-full md:h-32 object-cover rounded-md"
                              />
                            ) : (
                              <div
                                className="text-3xl font-bold mb-8 mt-8 text-foreground"
                                style={{ pointerEvents: "none" }}
                              >
                                <Upload></Upload>
                              </div>
                            )}
                            <Input
                              type="file"
                              accept="image/*"
                              className="absolute opacity-0 w-full h-full cursor-pointer"
                              onChange={onThumbnailChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full h-full flex flex-col justify-between mt-5 md:mt-1 space-y-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="title">Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} id="title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="name">
                            Short Description
                          </FormLabel>
                          <FormControl>
                            <Input {...field} id="name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="name">Duration</FormLabel>
                          <FormControl>
                            <PrefixInputRight
                              {...field}
                              prefix="minutes"
                              type="number"
                              name="length"
                              id="length"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-5 mt-5">
                  <div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={() => (
                        <FormItem className="">
                          <FormLabel htmlFor="name">Description</FormLabel>
                          <FormControl>
                            <div className="border-2 mt-4 min-h-[500px] h-auto p-3 rounded-md">
                              <Editor
                                initialBlocks={initialBlocksData}
                                updateEditorData={updateEditorData}
                                isReadonly={false}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Separator className="mt-4" />
                <div>
                  <h1 className="text-xl font-bold mt-6 text-secondary-foreground">
                    Pricing
                  </h1>
                </div>
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={() => (
                      <FormItem>
                        <FormLabel htmlFor="storeUrl">Currency</FormLabel>
                        <FormControl></FormControl>
                        <Select defaultValue="USD" disabled>
                          <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="storeUrl">Price</FormLabel>
                        <FormControl>
                          <Input {...field} id="price" type={"number"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* <FormField
                  control={form.control}
                  name="flexPrice"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-6 mb-6">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Flexible Pricing</FormLabel>
                        <FormDescription>
                          Allow users to pay what they want.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(newValue) => {
                            field.onChange(newValue);
                            form.setValue("recPrice", minPrice);
                            setFlexPrice(!newValue);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {!flexPrice && (
                  <div className="flex md:flex-row flex-col mt-6 md:space-x-6">
                    <FormField
                      control={form.control}
                      name="minPrice"
                      render={({ field }) => (
                        <FormItem className="md:w-1/2">
                          <FormLabel htmlFor="name">Minimum Price</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="minPrice"
                              disabled
                              placeholder="0"
                              value={minPrice}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recPrice"
                      render={({ field }) => (
                        <FormItem className="md:w-1/2">
                          <FormLabel htmlFor="recPrice">
                            Recommended Price
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="recPrice"
                              type="number"
                              placeholder="0"
                              min={0}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )} */}
                <Separator className="mt-8" />
                <div>
                  <h1 className="text-xl font-bold mt-6 text-secondary-foreground">
                    Visibility
                  </h1>
                </div>
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4 mb-6 ">
                      <div className="space-y-0.5">
                        <FormLabel>Product Visible</FormLabel>
                        <FormDescription>
                          Make this product visible on your profile. By default,
                          its private.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(newValue) => {
                            field.onChange(newValue);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button className="mt-10 w-32 items-center" type="submit">
                  <span>Submit</span>
                  {mutation.isLoading && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CalendarProductEdit;
