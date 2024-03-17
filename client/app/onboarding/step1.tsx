"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button, ButtonLoading, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Input, PrefixInputLeft } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthDetails } from "../components/AuthContext";
import {
  deleteFile,
  uploadFile,
  generateUploadURL,
} from "@/app/services/getS3url";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";
import { ErrorResponse } from "@/types/apiResponse";
import AxiosApi from "../services/axios";
import Image from "next/image";

//types
type Step1Props = {
  onFormSubmitSuccess: () => void;
};

//consts
const onboardingFormSchema = z.object({
  thumbnailUrl: z.string().optional(),
  username: z
    .string()
    .min(4, {
      message: "Username must be at least 4 characters.",
    })
    .max(34, {
      message: "Username must not be longer than 30 characters.",
    }),
  displayName: z
    .string()
    .min(2, {
      message: "Display name must be at least 2 characters.",
    })
    .max(50, {
      message: "Display name must not be longer than 30 characters.",
    }),
  description: z.string().max(150, {
    message: "Description must not be longer than 30 characters.",
  }),
});

export function Step1({ onFormSubmitSuccess }: Step1Props) {
  //consts
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const email = user?.emailAddresses[0].emailAddress;
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const authDetails = useAuthDetails();
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  //validateing if user is onboarded

  //form prefix logic
  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    defaultValues: {
      username: "",
      displayName: "",
      description: "",
    },
    resolver: zodResolver(onboardingFormSchema),
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof onboardingFormSchema>) {
    data.thumbnailUrl = imageUrl;
    mutation.mutate(data);
  }

  async function onThumbnailRemove() {
    setUploadingThumbnail(true);
    if (imageUrl !== "") {
      await deleteFile(imageUrl);
    }
    setSelectedFile("");
    setImageUrl("");
    setUploadingThumbnail(false);
  }

  useEffect(() => {
    if (authDetails.storeUrl) {
      toast({
        title: "User already onboarded!",
        duration: 3000,
      });
      router.push("/dashboard");
    } else if (authDetails.userId && !authDetails.storeUrl) {
      setIsLoading(false);
    }
  }, [isLoading, authDetails, router, toast]);

  async function getUploadURL(type: string) {
    return await generateUploadURL(type);
  }

  async function onThumbnailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUploadingThumbnail(true);
    if (imageUrl !== "") {
      await deleteFile(imageUrl);
    }
    const file = event.target.files?.[0];
    if (!file) return;
    const uploadUrl = await getUploadURL(file.type as string);
    const imageUrlFromS3 = await uploadFile(uploadUrl, file);
    if (imageUrlFromS3 === "") {
      setUploadingThumbnail(false);
      return;
    }
    setSelectedFile(imageUrlFromS3);
    setImageUrl(imageUrlFromS3);
    setUploadingThumbnail(false);
  }

  //save user data
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof onboardingFormSchema>) => {
      const combinedData = { ...data, userId, email };
      return AxiosApi(
        "POST",
        "/api/user/onboarding",
        combinedData,
        authDetails
      );
    },
    onSuccess: () => {
      user?.update({
        unsafeMetadata: { onboarded: true },
      });
      toast({
        title: "Success!",
        duration: 1000,
        description: "Your profile was created.",
      });
      onFormSubmitSuccess();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: error.response?.data?.error,
      });
    },
  });

  return (
    <div className="flex">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="thumbnailUrl"
            render={() => (
              <FormItem>
                <div className="flex flex-col items-center gap-2">
                  <FormLabel htmlFor="thumbnail">Profile Picture</FormLabel>
                  <FormControl>
                    <div
                      className={`h-24 w-24 md:h-32 md:w-32 border-2 rounded-s-full rounded-e-full flex flex-col items-center justify-center relative ${
                        selectedFile
                          ? "border-transparent"
                          : buttonVariants({ variant: "ghost" })
                      }`}
                    >
                      {uploadingThumbnail ? (
                        <Loader2 className="ml-2 h-6 w-6 animate-spin" />
                      ) : selectedFile ? (
                        <div className="relative w-full h-full">
                          <Image
                            width={1000}
                            height={1000}
                            src={selectedFile}
                            alt="Selected Thumbnail"
                            className="w-full h-full md:h-32 object-cover rounded-full transition-opacity"
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
                          className="text-3xl  font-bold mb-8 mt-8 text-foreground"
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
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormControl>
                  <div className="w-full">
                    <PrefixInputLeft
                      prefix="klipp.io/"
                      {...field}
                      id="username"
                    />
                  </div>
                </FormControl>
                <FormDescription>This is your unique username.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="displayName">Full Name</FormLabel>
                <FormControl>
                  <Input {...field} id="displayName" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormControl>
                  <Textarea {...field} id="description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {mutation.isLoading ? (
            <ButtonLoading />
          ) : (
            <Button type="submit">
              <span>Next</span>
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}

export default Step1;
