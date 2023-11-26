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
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import {
  Input,
  PrefixInputLeft,
  PrefixInputRight,
} from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
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

const calendarProductCreateSchema = z.object({
  title: z.string().min(1, { message: "Please enter product name" }),
  slug: z.string().min(1, { message: "Please enter product url" }),
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
  const storeUrl = authDetails.storeUrl;
  const [open, setOpen] = React.useState(false);
  const [slug, setSlug] = React.useState("");
  const form = useForm<z.infer<typeof calendarProductCreateSchema>>({
    defaultValues: {
      title: "",
      slug: "",
      length: "15",
      shortDescription: "",
    },
    resolver: zodResolver(calendarProductCreateSchema),
    mode: "all",
  });
  const { watch } = form;

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
      router.push(`/calendar/products/edit/?id=${calendarProductId}`);
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

  const onSubmit = (data: z.infer<typeof calendarProductCreateSchema>) => {
    createCalendarProductMutation.mutate(data);
  };

  // Watch for changes in the title field
  const title = watch("title");

  React.useEffect(() => {
    // Function to convert title to slug format
    const createSlug = (title: string) => {
      // Check if title is defined and is a string
      if (typeof title === "string") {
        return title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
      }
      return ""; // Return an empty string if title is not defined
    };

    // Update the slug state based on the title
    setSlug(createSlug(title));
    form.setValue("slug", createSlug(title));
  }, [title, form]); // Run this effect whenever the title changes

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
                  <Label htmlFor="url" className="text-right mt-3">
                    URL
                  </Label>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PrefixInputLeft
                              {...field}
                              prefix={`klipp.io/${storeUrl}/`}
                              id="slug"
                              defaultValue={slug} // Set the slug value here
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
                <Button type="submit">
                  <span>Save</span>
                  {createCalendarProductMutation.isLoading && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
