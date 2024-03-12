import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  CreditCard,
  ImageIcon,
  PercentIcon,
  ShoppingBag,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function DashboardCards() {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="flex md:flex-row flex-col gap-6">
          <Card
            onClick={() => router.push("/dashboard/settings")}
            className="md:w-2/6 p-3 w-full shadow-xl cursor-pointer"
          >
            <CardHeader className="p-3 flex flex-col ">
              <div className="h-16 flex items-center justify-center w-16 bg-accent rounded-full">
                <ImageIcon color="#7c5bcf" size={30} />
              </div>
              <CardTitle className="text-foreground pt-3">
                Update profile
              </CardTitle>
              <CardDescription className="text-foreground">
                Update your store profile information
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            onClick={() => router.push("/dashboard/payments")}
            className="md:w-2/6 p-3 w-full shadow-xl cursor-pointer"
          >
            <CardHeader className="p-3 flex flex-col ">
              <div className="h-16 flex items-center justify-center w-16 bg-accent rounded-full">
                <CreditCard color="#7c5bcf" size={30} />
              </div>
              <CardTitle className="text-foreground pt-3">
                Set up payments
              </CardTitle>
              <CardDescription className="text-foreground">
                Connect your stripe account
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            onClick={() => router.push("/dashboard/sales")}
            className="md:w-2/6 p-3 w-full shadow-xl cursor-pointer"
          >
            <CardHeader className="p-3 flex flex-col ">
              <div className="h-16 flex items-center justify-center w-16 bg-accent rounded-full">
                <PercentIcon color="#7c5bcf" size={30} />
              </div>
              <CardTitle className="text-foreground pt-3">
                Track your sales
              </CardTitle>
              <CardDescription className="text-foreground">
                View sales information for your store
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="flex md:flex-row flex-col gap-6">
          <Card
            onClick={() => router.push("/dashboard/calendar/schedule")}
            className="md:w-2/6 p-3 w-full shadow-xl cursor-pointer"
          >
            <CardHeader className="p-3 flex flex-col ">
              <div className="h-16 flex items-center justify-center w-16 bg-accent rounded-full">
                <CalendarClock color="#7c5bcf" size={30} />
              </div>
              <CardTitle className="text-foreground pt-3">
                Add availability
              </CardTitle>
              <CardDescription className="text-foreground">
                Update your availability settings
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            onClick={() => router.push("/dashboard/calendar/settings")}
            className="md:w-2/6 p-3 w-full shadow-xl cursor-pointer"
          >
            <CardHeader className="p-3 flex flex-col ">
              <div className="h-16 flex items-center justify-center w-16 bg-accent rounded-full">
                <Video color="#7c5bcf" size={30} />
              </div>
              <CardTitle className="text-foreground pt-3">
                Google Calendar
              </CardTitle>
              <CardDescription className="text-foreground">
                Connect your google calendar
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            onClick={() => router.push("/dashboard/digital-products")}
            className="md:w-2/6 p-3 w-full shadow-xl cursor-pointer"
          >
            <CardHeader className="p-3 flex flex-col ">
              <div className="h-16 flex items-center justify-center w-16 bg-accent rounded-full">
                <ShoppingBag color="#7c5bcf" size={30} />
              </div>
              <CardTitle className="text-foreground pt-3">
                Create a digital product
              </CardTitle>
              <CardDescription className="text-foreground">
                Create a digital product for your store
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;
