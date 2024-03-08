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
            className={cn("md:w-2/6 w-full shadow-xl cursor-pointer")}
          >
            <CardContent className={cn("")}>
              <div className="h-16 flex items-center justify-center align-items-center w-16 bg-accent rounded-full mt-5">
                <ImageIcon color="#7c5bcf" size={30} />
              </div>
            </CardContent>
            <CardHeader className={cn("p-0 ml-6 mb-4")} title="page visits">
              <CardTitle className="text-foreground">Update profile</CardTitle>
              <CardDescription className="text-foreground">
                Update your store profile information
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            onClick={() => router.push("/dashboard/payments")}
            className={cn("md:w-2/6 w-full shadow-xl cursor-pointer")}
          >
            <CardContent className={cn("")}>
              <div className="h-16 flex items-center justify-center align-items-center w-16 bg-red-300 rounded-full mt-5">
                <CreditCard color="#7c5bcf" size={30} />
              </div>
            </CardContent>
            <CardHeader className={cn("p-0 ml-6 mb-4")} title="page visits">
              <CardTitle className="text-red">Set up payments</CardTitle>
              <CardDescription className="text-foreground">
                Connect your stripe account
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            onClick={() => router.push("/dashboard/sales")}
            className={cn("md:w-2/6 w-full cursor-pointer shadow-xl ")}
          >
            <CardContent className={cn("")}>
              <div className="h-16 flex items-center justify-center align-items-center w-16 bg-accent rounded-full mt-5">
                <PercentIcon color="#7c5bcf" size={30} />
              </div>
            </CardContent>
            <CardHeader className={cn("p-0 ml-6 mb-4")} title="page visits">
              <CardTitle className="text-foreground">
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
            className={cn("md:w-2/6 w-full shadow-xl cursor-pointer")}
          >
            <CardContent className={cn("")}>
              <div className="h-16 flex items-center justify-center align-items-center w-16 bg-accent rounded-full mt-5">
                <CalendarClock color="#7c5bcf" size={30} />
              </div>
            </CardContent>
            <CardHeader className={cn("p-0 ml-6 mb-4")} title="page visits">
              <CardTitle className="text-foreground">
                Add availability
              </CardTitle>
              <CardDescription className="text-foreground">
                Update your availability settings
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            onClick={() => router.push("/dashboard/calendar/settings")}
            className={cn("md:w-2/6 w-full shadow-xl cursor-pointer")}
          >
            <CardContent className={cn("")}>
              <div className="h-16 flex items-center justify-center align-items-center w-16 bg-accent rounded-full mt-5">
                <Video color="#7c5bcf" size={30} />
              </div>
            </CardContent>
            <CardHeader className={cn("p-0 ml-6 mb-4")} title="page visits">
              <CardTitle className="text-foreground">Google Calendar</CardTitle>
              <CardDescription className="text-foreground">
                Connect your google calendar
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            onClick={() => router.push("/dashboard/digital-products")}
            className={cn("md:w-2/6 w-full shadow-xl cursor-pointer ")}
          >
            <CardContent className={cn("")}>
              <div className="h-16 flex items-center justify-center align-items-center w-16 bg-accent rounded-full mt-5">
                <ShoppingBag color="#7c5bcf" size={30} />
              </div>
            </CardContent>
            <CardHeader className={cn("p-0 ml-6 mb-4")} title="page visits">
              <CardTitle className="text-foreground">
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
