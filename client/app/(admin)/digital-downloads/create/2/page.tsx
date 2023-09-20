"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { generateUploadURL, uploadFile } from "@/app/services/getS3url";
import { Switch } from "@/components/ui/switch";

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
import Stepper from "../../../../../components/ui/custom/stepper";
import Editor from "@/components/ui/custom/editor/Editor";
//types

//consts
const digitalDownloadsSchema = z.object({
  file: z.string(),
  fileName: z.string(),
  link: z.string(),
  marketing_emails: z.boolean(),
  description: z.string(),
});

export function ProfileForm() {
  //consts
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showUploadFile, setShowUploadFile] = useState(true);
  const [editorData, setEditorData] = useState(null);

  const { toast } = useToast();

  //form prefix logic
  const form = useForm<z.infer<typeof digitalDownloadsSchema>>({
    defaultValues: {
      file: "",
      fileName: "",
      link: "",
      marketing_emails: false,
      description: "",
    },
    resolver: zodResolver(digitalDownloadsSchema),
  });

  function onSubmit(data: z.infer<typeof digitalDownloadsSchema>) {
    // data.thumbnail = imageUrl;
    // mutation.mutate(data);
    console.log(data);
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
    <div className="">
      <div className="bg-background p-10 rounded-l-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="md:w-1/2 w-full"
          >
            <div className="flex flex-row justify-center mb-10">
              <Stepper passedactiveStep={2} />
            </div>

            <div>
              <h1 className="text-xl font-bold mt-6 mb-6">Product</h1>
            </div>
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-6">
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
                    name="link"
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
                        <Editor />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button className="mt-10 w-32 items-center" type="submit">
              Next
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ProfileForm;
