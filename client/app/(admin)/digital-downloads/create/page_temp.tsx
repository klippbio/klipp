"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { generateUploadURL, uploadFile } from "@/app/services/getS3url";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Editor from "@/components/ui/custom/editor/Editor";
import { Card } from "@/components/ui/card";
//types

//consts
const digitalDownloadsSchema = z.object({
  thumbnail: z.string(),
  productName: z.string().min(2, {
    message: "Product name is required",
  }),
  shortDescription: z.string(),
  file: z.string(),
  fileName: z.string(),
  fileLink: z.string(),
  externalFile: z.boolean(),
  description: z.string(),
  price: z.string().min(1, {
    message: "Price is required",
  }),
  recPrice: z.string(),
  minPrice: z.string(),
  flexPrice: z.boolean(),
  visibility: z.boolean(),
});

export default function ProfileForm() {
  //consts
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showUploadFile, setShowUploadFile] = useState(true);
  const [editorData, setEditorData] = useState(null);
  const [flexPrice, setFlexPrice] = useState(true);
  const [priceState, setPriceState] = useState("");
  const fixedPrefix = "$ ";

  const updateEditorData = useCallback((state: any) => {
    setEditorData(state);
  }, []);

  const { toast } = useToast();

  //form prefix logic
  const form = useForm<z.infer<typeof digitalDownloadsSchema>>({
    defaultValues: {
      file: "",
      fileName: "",
      productName: "",
      shortDescription: "",
      fileLink: "",
      description: "",
      externalFile: false,
      visibility: false,
      flexPrice: false,
      price: fixedPrefix,
      minPrice: fixedPrefix,
      recPrice: fixedPrefix,
    },
    resolver: zodResolver(digitalDownloadsSchema),
  });

  const dynamicValue = form.watch("price");
  const dynamicValue2 = form.watch("recPrice");

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;

    setPriceState(newValue);

    if (!newValue.startsWith(fixedPrefix)) {
      newValue = fixedPrefix;
    } else {
      newValue = fixedPrefix + newValue;
    }
    form.setValue(
      "price",
      newValue.replace(fixedPrefix + fixedPrefix, fixedPrefix),
      { shouldDirty: true }
    );
  };

  const handleRecPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;

    if (!newValue.startsWith(fixedPrefix)) {
      newValue = fixedPrefix;
    } else {
      newValue = fixedPrefix + newValue;
    }

    form.setValue(
      "recPrice",
      newValue.replace(fixedPrefix + fixedPrefix, fixedPrefix),
      { shouldDirty: true }
    );
  };

  function onSubmit(data: z.infer<typeof digitalDownloadsSchema>) {
    // data.thumbnail = imageUrl;
    // mutation.mutate(data);
    console.log("data");
    //console.log(editorData);
  }

  // async function getUploadURL() {
  //   return await generateUploadURL();
  // }

  // async function onThumbnailChange(event: any) {
  //   const file = event.target.files[0];
  //   setSelectedFile(file);
  //   const uploadUrl = await getUploadURL();
  //   const imageUrl = await uploadFile(uploadUrl, file);
  //   setImageUrl(imageUrl);
  // }

  //save user data
  // const mutation = useMutation({
  //   mutationFn: async (data: z.infer<typeof digitalDownloadsSchema>) => {
  //     const combinedData = { ...data, userId };
  //     return axios.post("/api/digital-downloads/create", combinedData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${await getToken()}`,
  //         mode: "cors",
  //       },
  //     });
  //   },
  //   onSuccess: (data: any) => {
  //     const productId = data.data.id;
  //     console.log(data);
  //     router.push(`/digital-downloads/create/2/?productId=${productId}`);
  //     toast({
  //       title: "Success!",
  //       duration: 1000,
  //       description: "Product created successfully",
  //     });
  //   },
  //   onError: (error: any) => {
  //     toast({
  //       title: "Error",
  //       variant: "destructive",
  //       duration: 2000,
  //       description: error.response.data.error,
  //     });
  //   },
  // });
  const handleEditorSave = (data: any) => {
    setEditorData(data);
  };

  return (
    <Card className="m-5 p-5  md:w-2/3 w-full">
      <div className="">
        <div className="p-10 rounded-l-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div>
                <h1 className="text-xl font-bold mt-6 mb-6 text-primary">
                  Product Details
                </h1>
              </div>
              <div className="flex md:flex-row flex-col ">
                {/* <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="displayName">Thumbnail</FormLabel>
                      <FormControl>
                        <div
                          className={`w-full h-full md:h-32 md:w-32 border-2 flex flex-col items-center justify-center rounded-md relative ${
                            selectedFile
                              ? "border-transparent"
                              : buttonVariants({ variant: "ghost" })
                          }`}
                        >
                          {selectedFile ? (
                            <img
                              src={URL.createObjectURL(selectedFile)}
                              alt="Selected Thumbnail"
                              className="w-full h-full md:h-32 object-cover rounded-md"
                            />
                          ) : (
                            <div
                              className="text-3xl font-bold mb-8 mt-8 text-foreground"
                              style={{ pointerEvents: "none" }}
                            >
                              +
                            </div>
                          )}
                          <Input
                            type="file"
                            className="absolute opacity-0 w-full h-full cursor-pointer"
                            // onChange={onThumbnailChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <div className="w-full mt-5 md:mt-0  md:ml-5 space-y-5">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} id="name" />
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
                        <FormLabel htmlFor="name">Short Description</FormLabel>
                        <FormControl>
                          <Input {...field} id="name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="externalFile"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center mt-10 justify-between rounded-lg border p-3 shadow-sm mb-6">
                    <div className="space-y-0.5">
                      <FormLabel>Add external product link</FormLabel>
                      <FormDescription>
                        Add a link to your product instead of uploading a file.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(newValue) => {
                          field.onChange(newValue);
                          setShowUploadFile(!newValue);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {showUploadFile && (
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="displayName">Upload File</FormLabel>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className=" border-2 w-full h-32 flex flex-col items-center justify-center rounded-md relative"
                        >
                          <div
                            className="text-3xl font-bold mb-8 mt-8 text-foreground"
                            style={{ pointerEvents: "none" }}
                          >
                            +
                          </div>
                          <Input
                            type="file"
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          />
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div>
                {!showUploadFile && (
                  <div className="flex md:flex-row flex-col mt-6 md:space-x-6">
                    <FormField
                      control={form.control}
                      name="fileName"
                      render={({ field }) => (
                        <FormItem className="md:w-1/2">
                          <FormLabel htmlFor="name">File Name</FormLabel>
                          <FormControl>
                            <Input {...field} id="name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fileLink"
                      render={({ field }) => (
                        <FormItem className="md:w-1/2">
                          <FormLabel htmlFor="name">External Link</FormLabel>
                          <FormControl>
                            <Input {...field} id="name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <div className="py-5">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel htmlFor="name">Description</FormLabel>
                        <FormControl>
                          <Editor updateEditorData={updateEditorData} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="mt-4" />
              <div>
                <h1 className="text-xl font-bold mt-6 text-primary">Pricing</h1>
              </div>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="storeUrl">Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="price"
                        value={dynamicValue}
                        onChange={handlePriceChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
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
                            value={priceState}
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
                        <FormLabel htmlFor="name">Recommended Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="name"
                            value={dynamicValue2}
                            onChange={handleRecPriceChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <Separator className="mt-8" />
              <div>
                <h1 className="text-xl font-bold mt-6 text-primary">
                  Visibility
                </h1>
              </div>
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-6 mb-6">
                    <div className="space-y-0.5">
                      <FormLabel>Product Visibility</FormLabel>
                      <FormDescription>
                        Make this product visible on you profile. By default,
                        its private.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </Card>
  );
}
