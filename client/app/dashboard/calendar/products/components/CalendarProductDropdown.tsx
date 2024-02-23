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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthDetails } from "@/app/components/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosApi from "@/app/services/axios";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/lib/utils";
import { CalendarProductApiResponse } from "@/types/apiResponse";

export default function CalendarProductDropdown({
  item,
}: {
  item: CalendarProductApiResponse;
}) {
  const router = useRouter();
  const authDetails = useAuthDetails();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteCalendarProductMutation = useMutation({
    mutationFn: async () => {
      if (!item) {
        return Error("No product found");
      }
      const response = await AxiosApi(
        "DELETE",
        `/api/calendar-products/delete`,
        {
          storeId: authDetails.storeId,
          calendarProductId: item.id,
        },
        authDetails
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "calendarProducts",
        authDetails.storeId,
      ]);
      toast({
        title: "Success!",
        duration: 1000,
        description: "Schedule Deleted.",
      });
      router.push("/dashboard/calendar/products");
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

  function onDelete() {
    deleteCalendarProductMutation.mutate();
  }

  return (
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
              router.push(`/dashboard/calendar/products/edit?id=${item.id}`)
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
                Are you sure you want to delete this product?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
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
  );
}
