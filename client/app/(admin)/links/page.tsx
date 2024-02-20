"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Link, Loader2, Trash2, Upload } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DigitalDownloadSkeleton from "../digital-products/DigitalDownloadSkeleton";
import AxiosApi from "@/app/services/axios";
import { useAuthDetails } from "@/app/components/AuthContext";
import {
  deleteFile,
  generateUploadURL,
  uploadFile,
} from "@/app/services/getS3url";
import { AxiosError } from "axios";

type linkType = {
  title: string;
  description?: string | null;
  url: string;
  storeId?: string;
  thumbnailUrl?: string | null;
};

type itemType = {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  storeId?: string;
  thumbnailUrl?: string | null;
};

const linkCreateSchema = z.object({
  title: z.string().min(1, { message: "Please enter link title" }).max(30, {
    message: "Title must be not be more than 30 characters",
  }),
  description: z.string().optional(),
  url: z.string().url().min(4, { message: "Link Can not be empty" }),
  storeId: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authDetails = useAuthDetails();
  const storeId = authDetails?.storeId;

  const [selectedFile, setSelectedFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery<
    Array<itemType>,
    AxiosError
  >(
    ["allLinks", storeId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/link/getAllLinks/?id=${storeId}`,
        {},
        authDetails
      );
      return response.data;
    },
    {
      enabled: !!storeId,
    }
  );

  if (error?.response?.status === 500) {
    throw Error("Internal Server Error");
  }

  const { toast } = useToast();

  const form = useForm<z.infer<typeof linkCreateSchema>>({
    resolver: zodResolver(linkCreateSchema),
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof linkCreateSchema>) {
    data.storeId = storeId;
    const formData = {
      ...data,
      thumbnailUrl: imageUrl,
    };
    createProductMutation.mutate(formData);
  }

  async function onThumbnailRemove() {
    setSelectedFile("");
    setImageUrl("");
    return await deleteFile(imageUrl);
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

  const createProductMutation = useMutation({
    mutationFn: async (data: linkType) => {
      const response = await AxiosApi(
        "POST",
        "/api/link/create",
        data,
        authDetails
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        duration: 1000,
        description: "Link Created.",
      });
      setOpen(false);
      queryClient.invalidateQueries(["allLinks"]);
      //close the dialog
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Something went wrong",
      });
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosApi(
        "DELETE",
        `/api/link/deleteLink/?id=${id}`,
        authDetails
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allLinks"]);
      toast({
        title: "Success!",
        duration: 1000,
        description: "Link Deleted Successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Something went wrong",
      });
    },
  });

  return (
    <div>
      {isLoading || isError ? (
        <DigitalDownloadSkeleton />
      ) : (
        <div className="mt-4 mr-6 w-full grid ">
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Add Link</Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-xl">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                      <DialogTitle>Add a Link</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 w-full py-4">
                      <div className="flex">
                        {" "}
                        {/* Flex container for thumbnail and fields */}
                        {/* Thumbnail Upload Section */}
                        <div className="flex flex-col w-1/3">
                          {" "}
                          {/* Adjusted for thumbnail */}
                          <FormField
                            control={form.control}
                            name="thumbnailUrl"
                            render={() => (
                              <FormItem>
                                <div className="flex w-full flex-col gap-3">
                                  <FormLabel htmlFor="thumbnail">
                                    Thumbnail
                                  </FormLabel>
                                  <FormControl>
                                    <div
                                      className={`h-24 w-24 md:h-32 md:w-32 border-2  flex flex-col items-center justify-center relative  ${
                                        selectedFile
                                          ? "border-transparent"
                                          : buttonVariants({ variant: "ghost" })
                                      }`}
                                    >
                                      {selectedFile ? (
                                        <div className="relative rounded-lg w-full h-full">
                                          <img
                                            src={selectedFile}
                                            alt="Selected Thumbnail"
                                            className="w-full h-full object-cover transition-opacity"
                                          />
                                          <div className="flex items-center justify-center mt-2 text-red-500">
                                            <span
                                              onClick={onThumbnailRemove}
                                              className="text-sm flex items-center cursor-pointer"
                                            >
                                              Remove
                                            </span>
                                          </div>
                                        </div>
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
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        {/* Form Fields Section */}
                        <div className="w-2/3">
                          {" "}
                          {/* Adjusted for form fields */}
                          <div className="grid grid-cols-1 gap-3">
                            <Label htmlFor="title" className="col-span-1">
                              Title
                            </Label>
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} id="title" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* <Label htmlFor="description">Description</Label>
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea {...field} id="description" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            /> */}
                            <Label htmlFor="url">Url</Label>
                            <FormField
                              control={form.control}
                              name="url"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} id="url" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      {/* <div className="w-full flex flex-col mt-2 gap-3"></div> */}
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        <span>Save</span>
                        {createProductMutation.isLoading && (
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
      {data && data.length == 0 ? (
        <div className="flex justify-center">
          <Card className="flex m-4 md:w-1/3 w-full h-32 justify-center bg-secondary">
            <div className="flex flex-col justify-center items-center">
              <div className="text-l font-semibold text-foreground  ">
                No Links to Show
              </div>
              <div className="mt-2 text-sm">
                All your links will appear here.
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="md:flex md:flex-row gap-x-4 mt-4 flex-wrap">
          {data &&
            data.map((item: itemType) => (
              <Card
                className="md:w-1/3 rounded-l-full hover:bg-secondary rounded-r-full cursor-pointer w-full h-20 mb-4"
                key={item.title}
                onClick={() => {
                  router.push(item.url);
                }}
              >
                <div className="">
                  <div className="text-xl font-bold text-bold text-secondary-foreground">
                    <div className="flex flex-row justify-between">
                      <div className="p-2 rounded-full ">
                        {item.thumbnailUrl ? (
                          <div>
                            {" "}
                            <img
                              src={item.thumbnailUrl}
                              alt="Thumbnail"
                              className="h-16  rounded-full w-16  object-cover" // Adjust the size as needed
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                              <Link className="h-8 w-8 text-secondary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">{item.title}</div>
                      <div className="flex items-center mr-3">
                        <Button
                          variant={"ghost"}
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent click event from bubbling up to parent elements
                            deleteLinkMutation.mutate(item.id); // Call your delete function
                          }}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

export default Page;
