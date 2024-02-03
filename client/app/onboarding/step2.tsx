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

type OnboardingFormValues = {
  instagram: string;
  tiktok: string;
  twitter: string;
  youtube: string;
};

function Step2() {
  const onboardingFormSchema = z.object({
    instagram: z.string().min(4, {
      message: "Username must be at least 4 characters.",
    }),
    tiktok: z.string().min(4, {
      message: "Username must be at least 4 characters.",
    }),
    twitter: z.string().min(4, {
      message: "Username must be at least 4 characters.",
    }),
    youtube: z.string().min(4, {
      message: "Username must be at least 4 characters.",
    }),
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    let id = event.target.id;
    let placeholder = event.target.placeholder;

    if (!newValue.startsWith(placeholder)) {
      newValue = placeholder;
    } else {
      newValue = placeholder + newValue;
    }

    form.setValue(
      id,
      newValue.replace(placeholder + placeholder, placeholder),
      { shouldDirty: true }
    );

    // console.log(event.target.id);
  };

  function onSubmit(data: z.infer<typeof onboardingFormSchema>) {
    // data.username = data.username.replace(fixedPrefix, "");
    // mutation.mutate(data);
  }

  return (
    <div className="flex h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">Instagram</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="instagram"
                    placeholder="instagram.com/"
                    onChange={handleChange}
                  />
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
                  <Input
                    {...field}
                    id="twitter"
                    placeholder="twitter.com/"
                    onChange={handleChange}
                  />
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
                  <Input
                    {...field}
                    id="tiktok"
                    placeholder="tiktok.com/@"
                    onChange={handleChange}
                  />
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
                  <Input
                    {...field}
                    id="youtube"
                    placeholder="youtube.com/"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default Step2;
