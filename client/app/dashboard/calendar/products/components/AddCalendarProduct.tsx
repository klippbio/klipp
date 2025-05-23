import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, ButtonLoading } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input, PrefixInputRight } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AuthDetails } from "@/app/components/AuthContext";
import AxiosApi from "@/app/services/axios";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/apiResponse";

const calendarProductCreateSchema = z.object({
  title: z.string().min(1, { message: "Please enter product name" }),
  length: z.string().min(1, { message: "Please enter duration " }),
  shortDescription: z
    .string()
    .min(1, { message: "Please enter short description" }),
});

export default function AddCalendarProduct({
  authDetails,
}: {
  authDetails: AuthDetails;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof calendarProductCreateSchema>>({
    defaultValues: {
      title: "",
      length: "15",
      shortDescription: "",
    },
    resolver: zodResolver(calendarProductCreateSchema),
    mode: "all",
  });

  const createCalendarProductMutation = useMutation({
    mutationFn: async (data: z.infer<typeof calendarProductCreateSchema>) => {
      const combinedData = {
        ...data,
        storeId: authDetails.storeId,
        length: parseInt(data.length),
      };
      const response = await AxiosApi(
        "POST",
        "/api/calendar-products/create",
        combinedData,
        authDetails
      );
      return response.data;
    },
    onSuccess: async (data) => {
      toast({
        title: "Success!",
        duration: 1000,
        description: "Calendar Product Created.",
      });
      const calendarProductId = data.calendarProduct.id;
      router.push(`/dashboard/calendar/products/edit/?id=${calendarProductId}`);
    },
    onError: async (data: AxiosError<ErrorResponse>) => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: data.response?.data?.error,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof calendarProductCreateSchema>) => {
    createCalendarProductMutation.mutate(data);
  };

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add New Calendar Product</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[450px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Add Calendar Product</DialogTitle>
                <DialogDescription>
                  Create a new calendar product for people to book times.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 gap-4">
                  <Label htmlFor="title" className="text-right mt-3">
                    Title
                  </Label>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              name="title"
                              id="title"
                              placeholder="Quick Chat"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Label htmlFor="description" className="text-right mt-3">
                    Short Description
                  </Label>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              name="shortDescription"
                              id="shortDescription"
                              placeholder="A quick video meeting."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Label htmlFor="duration" className="text-right mt-3">
                    Duration
                  </Label>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PrefixInputRight
                              {...field}
                              prefix="minutes"
                              type="number"
                              name="length"
                              id="length"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                {createCalendarProductMutation.isLoading ? (
                  <ButtonLoading />
                ) : (
                  <Button type="submit">
                    <span>Save</span>
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
