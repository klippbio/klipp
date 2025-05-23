"use client";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonLoading, buttonVariants } from "@/components/ui/button";
import {
  deleteFile,
  generateUploadURL,
  uploadFile,
} from "@/app/services/getS3url";
import { Loader2, Upload } from "lucide-react";
import { Input, PrefixInputLeft } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AxiosApi from "@/app/services/axios";
import { useToast } from "@/components/ui/use-toast";
import { GradientPicker } from "@/components/ui/GradientPicker";
import { useAuthDetails } from "@/app/components/AuthContext";
import Image from "next/image";

const onboardingFormSchema = z.object({
  thumbnailUrl: z.string().optional(),
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
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  storeUrl: z.string(),
  color: z.string().optional(),
});
//eslint-disable-next-line
function UserSettings(data: any) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [background, setBackground] = useState("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const authDetails = useAuthDetails();
  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    defaultValues: {
      displayName: data.data.storeTitle || "",
      description: data.data.storeDescription || "",
      instagram: data.data.instagram || "",
      tiktok: data.data.tiktok || "",
      twitter: data.data.twitter || "",
      youtube: data.data.youtube || "",
      storeUrl: data.data.storeUrl || "",
    },
    resolver: zodResolver(onboardingFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    form.setValue("color", background);
  }, [background, form]);

  useEffect(() => {
    if (data.data.thumbnailUrl) {
      setSelectedFile(data.data.thumbnailUrl);
      setImageUrl(data.data.thumbnailUrl);
    }
    if (data.data.color) {
      setBackground(data.data.color);
    }
  }, [data.data.thumbnailUrl, data.data.color]);

  function onSubmit(data: z.infer<typeof onboardingFormSchema>) {
    data.thumbnailUrl = selectedFile;
    data.color = background;
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
  async function getUploadURL(type: string) {
    return await generateUploadURL(type);
  }

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof onboardingFormSchema>) => {
      const combinedData = {
        ...data,
        storeId: authDetails.storeId,
      };
      const response = await AxiosApi(
        "POST",
        `/api/publicuser/`,
        combinedData,
        authDetails
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        duration: 1000,
        description: "Profile Updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to update profile. Please contact support.",
      });
    },
  });

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
  return (
    <div className="w-full">
      <Card className="text-foreground">
        <CardHeader>
          <CardTitle>Update profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full flex flex-col">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 "
              >
                <div className="md:flex flex-none justify-between gap-12">
                  <div>
                    <FormField
                      control={form.control}
                      name="thumbnailUrl"
                      render={() => (
                        <FormItem>
                          <div className="flex flex-col items-center gap-2">
                            <FormLabel htmlFor="thumbnail">
                              Profile Picture
                            </FormLabel>
                            <FormControl>
                              <div
                                className={`h-40 w-40 md:h-40 md:w-40 border-2 rounded-s-full rounded-e-full flex flex-col items-center justify-center relative ${
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
                                      src={selectedFile}
                                      width={1000}
                                      height={1000}
                                      alt="Selected Thumbnail"
                                      className="w-full h-full md:h-40 object-cover rounded-full transition-opacity"
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
                  </div>
                  <div className="flex flex-col gap-4 justify-start md:w-1/2 w-full">
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
                          <FormLabel htmlFor="description">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea {...field} id="description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-7 md:mt-0 mt-6">
                    <div className="flex flex-col gap-7">
                      <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="username">Instagram</FormLabel>
                            <FormControl>
                              <div className="w-full">
                                <PrefixInputLeft
                                  id="instagram"
                                  prefix="instagram.com/"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="twitter">Twitter</FormLabel>
                            <FormControl>
                              <div className="w-full">
                                <PrefixInputLeft
                                  id="twitter"
                                  prefix="twitter.com/"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-7">
                      <FormField
                        control={form.control}
                        name="tiktok"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="tiktok">Tiktok</FormLabel>
                            <FormControl>
                              <div className="w-full">
                                <PrefixInputLeft
                                  id="tiktok"
                                  prefix="tiktok.com/@"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="youtube"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="youtube">Youtube</FormLabel>
                            <FormControl>
                              <div className="w-full">
                                <PrefixInputLeft
                                  id="youtube"
                                  prefix="youtube.com/@/"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="color"
                  render={() => (
                    <FormItem>
                      <FormLabel htmlFor="youtube">Background Color</FormLabel>
                      <FormControl>
                        <div className="w-full mt-4">
                          <GradientPicker
                            className="w-full truncate"
                            background={background}
                            setBackground={setBackground}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  {mutation.isLoading ? (
                    <ButtonLoading />
                  ) : (
                    <Button type="submit">
                      <span>Save</span>
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserSettings;
