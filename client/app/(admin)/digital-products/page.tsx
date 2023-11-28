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
import { useRouter } from "next/navigation";
import { Loader2, MoreVertical, Pencil, Trash } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DigitalDownloadSkeleton from "./DigitalDownloadSkeleton";
import AxiosApi from "@/app/services/axios";
import { useAuthDetails } from "@/app/components/AuthContext";

type ddType = {
  name: string;
  price: string;
};

type itemType = {
  name: string;
  price: string;
  id: string;
  visibility: boolean;
  currency: string[];
};

const ddCreateSchema = z.object({
  name: z.string().min(1, { message: "Please enter product name" }).max(30, {
    message: "Product name must be not be more than 30 characters",
  }),
  price: z.string(),
  storeId: z.string().optional(),
});

function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authDetails = useAuthDetails();
  const storeId = authDetails?.storeId;

  const { data, isLoading } = useQuery(
    ["allProducts", storeId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/digital-products/getAllDigitalProducts/?id=${storeId}`,
        {},
        authDetails
      );
      return response.data;
    },
    {
      enabled: !!storeId,
    }
  );

  const { toast } = useToast();

  const form = useForm<z.infer<typeof ddCreateSchema>>({
    resolver: zodResolver(ddCreateSchema),
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof ddCreateSchema>) {
    data.storeId = storeId;
    createProductMutation.mutate(data);
  }

  //TODO: Add delete mutation
  async function deleteProduct(id: string) {
    const response = await fetch(
      `/api/digital-products/deleteDigitalProduct/?id=${id}`,
      {
        method: "DELETE",
      }
    );
    await queryClient.invalidateQueries(["allProducts", storeId]);
    if (!response?.ok) {
      toast({
        title: "Something went wrong.",
        duration: 2000,
        description: "Your product was not deleted. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        duration: 2000,
        description: "Product Deleted Successfully",
      });
    }
    return true;
  }

  const createProductMutation = useMutation({
    mutationFn: async (data: ddType) => {
      const response = await AxiosApi(
        "POST",
        "/api/digital-products/create",
        data,
        authDetails
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        duration: 1000,
        description: "Product Created.",
      });

      const productId = data.DigitalProduct.id;
      router.push(`/digital-products/create/?id=${productId}`);
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

  return (
    <div>
      {isLoading ? (
        <DigitalDownloadSkeleton />
      ) : (
        <div className="mt-4 mr-6 grid ">
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Product</Button>
              </DialogTrigger>
              <DialogContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                      <DialogTitle>Add Product</DialogTitle>
                      <DialogDescription>
                        Enter the name and price of your digital product.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 ">
                      <div className="grid grid-cols-4 gap-4 ">
                        <Label htmlFor="name" className="text-right pt-3">
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
                      <div className="grid grid-cols-4 gap-4">
                        <Label className="text-right pt-3">Price</Label>

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
                        <span>Save</span>
                        {createProductMutation.isLoading && (
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
      {data && data.length == 0 ? (
        <div className="flex justify-center">
          <Card className="flex m-4 md:w-1/3 w-full h-32 justify-center bg-secondary">
            <div className="flex flex-col justify-center items-center">
              <div className="text-l font-semibold text-foreground  ">
                No Products to Show
              </div>
              <div className="mt-2 text-sm">
                Digital products will appear here.
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="md:flex md:flex-row gap-x-4 mt-4 flex-wrap">
          {data &&
            data.map((item: itemType) => (
              <Card className="md:w-1/3 w-full h-32 mb-4" key={item.name}>
                <div className="p-6">
                  <div className="text-xl justify-center font-bold text-bold text-secondary-foreground">
                    <div className="flex flex-row justify-between">
                      <div>{item.name}</div>
                      <div className="mt-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild={true}>
                            <Button variant="ghost">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <AlertDialog>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/digital-products/create/?id=${item.id}`
                                  )
                                }
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />

                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to delete this
                                    product?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={async () => {
                                      await deleteProduct(item.id);
                                    }}
                                    className="bg-destructive hover:bg-destructive"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />

                                    <span>Delete</span>
                                  </AlertDialogAction>{" "}
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-row gap-6">
                    <div className="text-l font-semiBold">{`USD ${item.price}`}</div>
                    <Badge variant={"outline"} className="h-6">
                      {item.visibility ? "Public" : "Private"}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

export default Page;
