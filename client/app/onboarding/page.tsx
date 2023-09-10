"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, use } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
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

//types
type OnboardingFormValues = {
  storeUrl: string;
  storeTitle: string;
  storeDescription: string;
};

//consts
const onboardingFormSchema = z.object({
  storeUrl: z
    .string()
    .min(14, {
      message: "Username must be at least 4 characters.",
    })
    .max(34, {
      message: "Username must not be longer than 30 characters.",
    }),
  storeTitle: z
    .string()
    .min(2, {
      message: "Display name must be at least 2 characters.",
    })
    .max(50, {
      message: "Display name must not be longer than 30 characters.",
    }),
  storeDescription: z.string().max(150, {
    message: "Description must not be longer than 30 characters.",
  }),
});

export function ProfileForm() {
  //consts
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const email = user?.emailAddresses[0].emailAddress;
  const router = useRouter();
  const { toast } = useToast();
  const fixedPrefix = "klipp.bio/";

  //validateing if user is onboarded
  useEffect(() => {
    if (user?.unsafeMetadata.onboarded) {
      router.push("/dashboard");
    }
  }, [user]);

  //form prefix logic
  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    defaultValues: {
      storeUrl: fixedPrefix,
      storeTitle: "",
      storeDescription: "",
    },
    resolver: zodResolver(onboardingFormSchema),
  });

  function onSubmit(data: z.infer<typeof onboardingFormSchema>) {
    data.storeUrl = data.storeUrl.replace(fixedPrefix, "");
    mutation.mutate(data);
  }

  const dynamicValue = form.watch("storeUrl");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;

    // If the input doesn't start with the fixed prefix, add it
    if (!newValue.startsWith(fixedPrefix)) {
      newValue = fixedPrefix;
    } else {
      newValue = fixedPrefix + newValue;
    }

    // Set the value and make sure it's not prefixed twice
    form.setValue(
      "storeUrl",
      newValue.replace(fixedPrefix + fixedPrefix, fixedPrefix),
      { shouldDirty: true }
    );
  };

  //save user data
  const mutation = useMutation({
    mutationFn: async (data: OnboardingFormValues) => {
      const combinedData = { ...data, userId, email };
      return axios.post("/api/user/onboarding", combinedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
          mode: "cors",
        },
      });
    },
    onSuccess: (data) => {
      user?.update({
        unsafeMetadata: { onboarded: true },
      });
      console.log(data);
      toast({
        title: "Success!",
        duration: 1000,
        description: "Your profile was created.",
      });
      router.push("/dashboard");
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

  if (user?.unsafeMetadata.onboarded) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Left Section */}

      <div className="flex-1 bg-background p-10 flex flex-col justify-center items-center rounded-l-lg">
        <h1 className="text-3xl font-bold mb-6">klipp</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="storeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="storeUrl">Unique Url</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="storeUrl"
                      value={dynamicValue}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your unique url. You can change it later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="storeTitle">Title</FormLabel>
                  <FormControl>
                    <Input {...field} id="storeTitle" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="storeDescription">Description</FormLabel>
                  <FormControl>
                    <Input {...field} id="storeDescription" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Next</Button>
          </form>
        </Form>
      </div>

      {/* Right Section */}
      <div className="flex bg-foreground lg:w-1/3 md:w-1/4"></div>
    </div>
  );
}

export default ProfileForm;
