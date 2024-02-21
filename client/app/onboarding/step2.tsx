"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PrefixInputLeft } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ErrorResponse } from "@/types/apiResponse";
import AxiosApi from "../services/axios";
import { useAuthDetails } from "../components/AuthContext";

type OnboardingFormValues = {
  instagram: string;
  tiktok: string;
  twitter: string;
  youtube: string;
};

function Step2() {
  const { userId } = useAuth();
  const authDetails = useAuthDetails();
  const { user } = useUser();
  const email = user?.emailAddresses[0].emailAddress;

  const { toast } = useToast();
  const router = useRouter();

  const onboardingFormSchema = z.object({
    instagram: z.string().optional().default(""),
    tiktok: z.string().optional().default(""),
    twitter: z.string().optional().default(""),
    youtube: z.string().optional().default(""),
  });

  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    defaultValues: {
      instagram: "",
      tiktok: "",
      twitter: "",
      youtube: "",
    },
    resolver: zodResolver(onboardingFormSchema),
  });

  function onSubmit(data: z.infer<typeof onboardingFormSchema>) {
    console.log(data);
    // data.username = data.username.replace(fixedPrefix, "");
    mutation.mutate(data);
  }

  const mutation = useMutation({
    mutationFn: async (data: OnboardingFormValues) => {
      const combinedData = { ...data, userId, email };
      return AxiosApi(
        "POST",
        "/api/user/onboarding/socials",
        combinedData,
        authDetails
      );
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        duration: 1000,
        description: "Your profile was created.",
      });
      router.push("/dashboard");
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
    <div className="flex flex-col w-full max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
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
          <div className="flex gap-4 items-center">
            <Button type="submit">Submit</Button>
            <a href="/dashboard">Skip</a>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Step2;
