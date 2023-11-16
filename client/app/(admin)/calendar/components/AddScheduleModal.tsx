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
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosApi from "@/app/services/axios";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

const scheduleCreateSchema = z.object({
  name: z.string().min(1, { message: "Please enter schedule name" }).max(30, {
    message: "Schedule name must be not be more than 30 characters",
  }),
});

export default function AddScheduleModal({ authDetails }) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof scheduleCreateSchema>>({
    resolver: zodResolver(scheduleCreateSchema),
    mode: "all",
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof scheduleCreateSchema>) => {
      const combinedData = {
        ...data,
        storeId: authDetails.storeId,
      };
      const response = await AxiosApi(
        "POST",
        "/api/calendar/create",
        combinedData,
        authDetails
      );
      return response.data;
    },
    onSuccess: async (data) => {
      toast({
        title: "Success!",
        duration: 1000,
        description: "Schedule Created.",
      });
      await queryClient.invalidateQueries([
        "allScehdules",
        authDetails?.storeId,
      ]);
      router.push("?scheduleId=" + data.id);
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

  const onSubmit = (data: z.infer<typeof scheduleCreateSchema>) => {
    createScheduleMutation.mutate(data);
    console.log(data, "data");
  };

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Schedule</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Add Schedule</DialogTitle>
                <DialogDescription>
                  Enter the name for this schedule
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 ">
                <div className="grid grid-cols-4 gap-4 ">
                  <Label htmlFor="name" className="text-right mt-3">
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
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setOpen(false)}>
                  <span>Save</span>
                  {createScheduleMutation.isLoading && (
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
