"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Copy, Eye, Loader2 } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type ddType = {
  name: string;
  price: string;
};

const ddCreateSchema = z.object({
  name: z.string().min(1, { message: "Please enter product name" }).max(30, {
    message: "Product name must be not be more than 30 characters",
  }),
  price: z.string(),
  storeId: z.string().optional(),
});

function digitalDownloadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof ddCreateSchema>>({
    resolver: zodResolver(ddCreateSchema),
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof ddCreateSchema>) {
    setIsSaving(true);
    data.storeId = "d627bb9e-3605-43d8-b472-98e4f19b7c67";
    mutation.mutate(data);
  }

  const mutation = useMutation({
    mutationFn: async (data: ddType) => {
      return axios.post("/api/digital-downloads/create", data, {});
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        duration: 1000,
        description: "Product Created.",
      });
      const storeId = data.data.id;
      router.push(`/digital-downloads/create/?id=${storeId}`);
      setIsSaving(true);
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
    <div>
      <div className="mt-4 mr-6 grid justify-items-end">
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogDescription>
                      Enter the name and price of your digital product.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 ">
                    <div className="grid grid-cols-4 items-center gap-4 ">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} name="name" id="name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Price</Label>

                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  name="name"
                                  type="number"
                                  id="name"
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
                      {isSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <span>Save</span>
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="md:flex md:flex-row m-4 gap-4 ">
        <Card className="md:w-1/3 w-full h-32 mb-4">
          <div className="p-6">
            <div className="text-xl font-bold text-bold text-secondary-foreground">
              <div className="flex flex-row space-x-2">
                <div>E-Book</div>
                <div>
                  <Eye></Eye>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-row gap-8">
              <div>$30</div>
              <div>
                <Button className="h-" variant={"outline"}>
                  <Copy size={15} />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default digitalDownloadPage;
