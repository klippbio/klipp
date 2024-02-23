import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input, PrefixInputLeft } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  deleteFile,
  generateUploadURL,
  uploadFile,
} from "@/app/services/getS3url";
import { Pencil, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import AxiosApi from "@/app/services/axios";
import { useToast } from "@/components/ui/use-toast";
import { GradientPicker } from "@/components/ui/GradientPicker";
import { store } from "../..";
import { AuthDetails } from "@/app/components/AuthContext";

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
export function SidePanelEdit({
  data,
  username,
  authDetails,
}: {
  data: store;
  username: string;
  authDetails: AuthDetails;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [background, setBackground] = useState("");
  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    defaultValues: {
      displayName: data.storeTitle || "",
      description: data.storeDescription || "",
      instagram: data.instagram || "",
      tiktok: data.tiktok || "",
      twitter: data.twitter || "",
      youtube: data.youtube || "",
      storeUrl: data.storeUrl || "",
    },
    resolver: zodResolver(onboardingFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    form.setValue("color", background);
  }, [background, form]);

  useEffect(() => {
    if (data.thumbnailUrl) {
      setSelectedFile(data.thumbnailUrl);
      setImageUrl(data.thumbnailUrl);
    }
    if (data.color) {
      setBackground(data.color);
    }
  }, [data.thumbnailUrl, data.color]);

  function onSubmit(data: z.infer<typeof onboardingFormSchema>) {
    data.thumbnailUrl = selectedFile;
    data.color = background;
    mutation.mutate(data);
  }

  async function onThumbnailRemove() {
    setSelectedFile("");
    setImageUrl("");
    return await deleteFile(imageUrl);
  }

  async function getUploadURL() {
    return await generateUploadURL();
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
      setOpen(false);
      queryClient.invalidateQueries(["userDetails", username]);
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: "Failed to update profile. Please contact support.",
      });
      setOpen(false);
    },
  });

  async function onThumbnailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const uploadUrl = await getUploadURL();
    const imageUrl = await uploadFile(uploadUrl, file);
    setSelectedFile(imageUrl);
    setImageUrl(imageUrl);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="h-14 rounded-2xl w-1/3 space-x-2 hover:bg-input hover:text-accent-foreground"
        >
          <Pencil className="w-4 h-4 lg:w-6 lg:h-6" />
          <span className="text-sm sm:text-base">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={"overflow-y-scroll md:overflow-auto max-h-screen"}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
              <div className="flex-none justify-between gap-12">
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
                              className={`h-40 w-40 border-2 rounded-s-full rounded-e-full flex flex-col items-center justify-center relative ${
                                selectedFile
                                  ? "border-transparent"
                                  : buttonVariants({ variant: "ghost" })
                              }`}
                            >
                              {selectedFile ? (
                                <div className="relative w-full h-full">
                                  <img
                                    src={selectedFile}
                                    alt="Selected Thumbnail"
                                    className="w-full h-full object-cover rounded-full transition-opacity"
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
                <div className="flex flex-col gap-4 justify-start  w-full">
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
                </div>
                <div className="flex gap-3 md:mt-0 mt-6">
                  <div className="flex flex-col gap-3">
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
                  <div className="flex flex-col gap-3">
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
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
