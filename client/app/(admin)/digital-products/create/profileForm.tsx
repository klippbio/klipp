//TODO: Rename files in Bucket with storename + salt
//TODO: Add file limits
//TODO: Add file type validation
//TODO: Add file size validation
//TODO: Sapertate folders for all different file types
//TODO: Fix StoreId issue
//TODO: Add Auth to API routes
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import {
  generateUploadURL,
  uploadFile,
  deleteFile,
} from "@/app/services/getS3url";
import Editor from "@/components/ui/custom/editor/Editor";
import { Loader2, Trash, Upload } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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

//types
const digitalDownloadsSchema = z
  .object({
    name: z.string(),
    shortDescription: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    externalFile: z.boolean().optional().default(false),
    description: z.string().optional(),
    file: z.string().optional(),
    currency: z.string().array().default(["USD"]),
    price: z.string().default("0"),
    recPrice: z.string().optional(),
    minPrice: z.string().optional(),
    flexPrice: z.boolean().optional(),
    visibility: z.boolean().optional().default(false),
    urls: z
      .array(
        z.object({
          name: z.string().optional(),
          url: z.string().optional(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.recPrice !== undefined &&
        data.recPrice !== "" &&
        data.price !== undefined &&
        data.price !== ""
      ) {
        return Number(data.price) <= Number(data.recPrice);
      }
      return true;
    },
    {
      message: "Price must be less than recPrice",
      path: ["recPrice"],
    }
  );

type fileType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  url: string;
  digitalProductId: number;
};

interface dataType {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  price: string;
  recPrice: string;
  minPrice: string;
  description: string;
  currency: string[];
  storeItemId: number;
  shortDescription: string;
  flexPrice: boolean;
  externalFile: boolean;
  visibility: boolean;
  urls: string;
  thumbnailUrl: string;
  createdBy: null;
  ddFiles: fileType[];
}
type AccountFormValues = z.infer<typeof digitalDownloadsSchema>;

export function ProfileForm({
  data,
  productId,
}: {
  data: dataType;
  productId: number;
}) {
  //consts
  const authDetails = useAuthDetails();
  const [showUploadFile, setShowUploadFile] = useState(true);
  const [selectedFile, setSelectedFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editorData, setEditorData] = useState("");
  const [flexPrice, setFlexPrice] = useState(true);
  const [minPrice, setMinPrice] = useState("0");
  const [uploadedFiles, setUploadedFiles] = useState<fileType[]>([]);
  const [initialBlocksData, setInitialBlocksData] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  //eslint-disable-next-line
  const updateEditorData = useCallback((state: any) => {
    setEditorData(state);
  }, []);
  const productData = data as dataType;

  const defaultValues: Partial<AccountFormValues> = {
    name: productData.name || "",
    shortDescription: productData.shortDescription || "",
    externalFile: productData.externalFile || false,
    currency: productData.currency || "USD",
    price: productData.price || "",
    recPrice: productData.recPrice || "",
    minPrice: productData.minPrice || "",
    flexPrice: productData.flexPrice || false,
    visibility: productData.visibility || false,
    urls: JSON.parse(productData.urls) || [{ name: "", url: "" }],
  };

  const form = useForm<z.infer<typeof digitalDownloadsSchema>>({
    defaultValues: defaultValues,
    resolver: zodResolver(digitalDownloadsSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control: form.control,
    rules: { maxLength: 3 },
  });

  const { watch } = form;

  //effects
  useEffect(() => {
    if (productData.externalFile) {
      setShowUploadFile(false);
    }

    if (productData.thumbnailUrl) {
      setSelectedFile(productData.thumbnailUrl);
      setImageUrl(productData.thumbnailUrl);
    }
    if (productData.flexPrice) {
      setFlexPrice(false);
    }
    if (productData.description) {
      const parsedDescription = JSON.parse(productData.description);
      setEditorData(parsedDescription);
      setInitialBlocksData(parsedDescription.blocks);
    }

    if (productData.ddFiles) {
      setUploadedFiles(productData.ddFiles);
    }
  }, [
    productData.ddFiles,
    productData.description,
    productData.externalFile,
    productData.flexPrice,
    productData.thumbnailUrl,
  ]);

  useEffect(() => {
    const price = watch("price");

    setMinPrice(price);

    form.setValue("minPrice", price);
  }, [form, watch]);

  //functions
  function onSubmit(data: z.infer<typeof digitalDownloadsSchema>) {
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

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const uploadUrl = await getUploadURL();
    const fileUrl = await uploadFile(uploadUrl, file);
    const modData = {
      url: fileUrl,
      name: file.name,
    };
    await mutateUploadFile.mutate(modData);
  }

  //mutations
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof digitalDownloadsSchema>) => {
      const response = await AxiosApi(
        "POST",
        `/api/digital-products/update/?id=${productId}`,
        data,
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
      router.push("/digital-products");
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to create product",
      });
    },
  });

  const mutateUploadFile = useMutation({
    mutationFn: async (data: { url: string; name: string }) => {
      setUploadingFile(true);
      const response = await AxiosApi(
        "post",
        `/api/digital-products/file/?id=${productId}`,
        data,
        authDetails
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        duration: 1000,
        description: "File uploaded successfully.",
      });
      setUploadedFiles([...uploadedFiles, data]);
      console.log("uploaded", uploadedFiles);
      setUploadingFile(false);
    },
    onError: () => {
      setUploadingFile(false);
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to upload file",
      });
    },
  });

  const delteMutation = useMutation({
    mutationFn: async (file: fileType) => {
      const fileId = file.id;
      const fielUrl = file.url;
      await deleteFile(fielUrl);
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file: fileType) => file.id !== fileId)
      );
      const response = await AxiosApi(
        "delete",
        `/api/digital-products/file/?id=${fileId}`,
        {},
        authDetails
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        duration: 1000,
        description: "File Deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to delete file",
      });
    },
  });

  return (
    <Card className="my-4 lg:w-2/3">
      <CardHeader>
        <CardTitle className="text-foreground text-lg">
          Digital Products
        </CardTitle>
        <CardDescription>
          Enter details about your digital product.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="">
          <div className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="flex md:flex-row flex-col ">
                  <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={() => (
                      <FormItem>
                        <FormLabel htmlFor="thumbnail">Thumbnail</FormLabel>
                        <FormControl>
                          <div
                            className={`w-full h-32 md:h-32 md:w-32 border-2 flex flex-col items-center justify-center rounded-md relative ${
                              selectedFile
                                ? "border-transparent"
                                : buttonVariants({ variant: "ghost" })
                            }`}
                          >
                            {selectedFile ? (
                              <img
                                src={selectedFile}
                                alt="Selected Thumbnail"
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
                  <div className="w-full mt-5 md:mt-0  md:ml-5 space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
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
                          Add a link to your product instead of uploading a
                          file.
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

                <div>
                  {!showUploadFile &&
                    fields.map((field, index) => (
                      <div key={field.id}>
                        <div className="flex md:flex-row flex-col mt-6 md:space-x-6">
                          <FormField
                            control={form.control}
                            name={`urls.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="md:w-1/2">
                                <FormLabel htmlFor="name">File Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`urls.${index}.url`}
                            render={({ field }) => (
                              <FormItem className="md:w-1/2">
                                <FormLabel htmlFor="name">
                                  External Link
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            variant="secondary"
                            size="icon"
                            type="button"
                            className="mt-8"
                            onClick={() => remove(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {!showUploadFile && (
                    <Button
                      type="button"
                      size="sm"
                      className="mt-6 mb-6 border-primary text-primary"
                      disabled={fields.length >= 5}
                      variant={"outline"}
                      onClick={() => append({ name: "", url: "" })}
                    >
                      Add File
                    </Button>
                  )}

                  <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                      <FormItem>
                        <FormLabel htmlFor="displayName">Upload File</FormLabel>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className=" border-2 w-full h-16 flex flex-col items-center justify-center rounded-md relative"
                          >
                            <div
                              className=" font-bold mb-8 mt-8"
                              style={{ pointerEvents: "none" }}
                            >
                              {uploadingFile ? (
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              ) : (
                                <div className="flex flex-row">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5 mr-2"
                                  >
                                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                                  </svg>
                                  Upload your files here
                                </div>
                              )}
                            </div>

                            <Input
                              type="file"
                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                              onChange={onFileChange}
                            />
                          </Button>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    {uploadedFiles.map((file: fileType, index) => (
                      <div
                        key={index}
                        className="mt-4 flex flex-row justify-between"
                      >
                        <div className="ml-2">{file.name}</div>
                        <div>
                          <Button
                            variant="secondary"
                            size="icon"
                            type="button"
                            className="mr-2"
                            onClick={() => {
                              delteMutation.mutate(file);
                              remove(index);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="py-5">
                    <FormField
                      control={form.control}
                      name="description"
                      render={() => (
                        <FormItem className="">
                          <FormLabel htmlFor="name">Description</FormLabel>
                          <FormControl>
                            <Editor
                              initialBlocks={initialBlocksData}
                              updateEditorData={updateEditorData}
                            />
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
                        <Select defaultValue="USD">
                          <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
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
                )}
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
                        <FormLabel>Product Visibility</FormLabel>
                        <FormDescription>
                          Make this product visible on you profile. By default,
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

export default ProfileForm;
