"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { generateUploadURL, uploadFile } from "@/app/services/getS3url";
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
import Stepper from "../../../../components/ui/custom/stepper";
import Link from "next/link";
import { cn } from "@/lib/utils";

//types

//consts
const digitalDownloadsSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  shortDescription: z.string().nonempty({ message: "Description is required" }),
  thumbnail: z.string(),
});

export function ProfileForm() {
  //consts
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const email = user?.emailAddresses[0].emailAddress;
  const [showUploadFile, setShowUploadFile] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const { toast } = useToast();

  //form prefix logic
  const form = useForm<z.infer<typeof digitalDownloadsSchema>>({
    defaultValues: {
      name: "",
      shortDescription: "",
      thumbnail: "",
    },
    resolver: zodResolver(digitalDownloadsSchema),
  });

  function onSubmit(data: z.infer<typeof digitalDownloadsSchema>) {
    data.thumbnail = imageUrl;
    mutation.mutate(data);
  }

  async function getUploadURL() {
    return await generateUploadURL();
  }

  async function onThumbnailChange(event: any) {
    const file = event.target.files[0];
    setSelectedFile(file);
    const uploadUrl = await getUploadURL();
    const imageUrl = await uploadFile(uploadUrl, file);
    setImageUrl(imageUrl);
  }

  //save user data
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof digitalDownloadsSchema>) => {
      const combinedData = { ...data, userId };
      return axios.post("/api/digital-downloads/create", combinedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
          mode: "cors",
        },
      });
    },
    onSuccess: (data: any) => {
      const productId = data.data.id;
      console.log(data);
      router.push(`/digital-downloads/create/2/?productId=${productId}`);
      toast({
        title: "Success!",
        duration: 1000,
        description: "Product created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: error.response.data.error,
      });
    },
  });

  return (
    <div className="">
      <div className="bg-background p-10 rounded-l-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="md:w-1/2 w-full"
          >
            <div className="flex flex-row justify-center mb-10">
              <Stepper passedactiveStep={1} />
            </div>

            <div className="flex md:flex-row flex-col ">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="displayName">Thumbnail</FormLabel>
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
