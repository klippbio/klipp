// app/layout.tsx
"use client";
import "../globals.css";
import { SideNav } from "../components/sideNav";
import { BottomBar } from "../components/bottomBar";
import {
  DollarSignIcon,
  BadgeDollarSign,
  CalendarCheck,
  CalendarClock,
  FileCheck2,
  Link,
  SettingsIcon,
} from "lucide-react/";
import { HomeIcon } from "lucide-react/";
import { Server } from "lucide-react/";
import { Separator } from "@/components/ui/separator";
import { useAuthDetails } from "../components/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authDetails = useAuthDetails();
  const navItems = [
    {
      title: "Home",
      href: "/app/home",
      baseHref: "/app/home",
      icon: <HomeIcon size={20} />,
    },
    {
      title: "Calendar",
      href: "/app/calendar/products",
      baseHref: "/app/calendar",
      icon: <CalendarClock size={20} />,
    },
    {
      title: "Store",
      href: "/" + authDetails?.storeUrl,
      baseHref: "/" + authDetails?.storeUrl,
      icon: <Server size={20} />,
    },
    {
      title: "Digital Products",
      href: "/app/digital-products",
      baseHref: "/app/digital-products",
      icon: <FileCheck2 size={20} />,
    },
    {
      title: "My Bookings",
      href: "/app/bookings",
      baseHref: "/app/bookings",
      icon: <CalendarCheck size={20} />,
    },
    {
      title: "Sales",
      href: "/sales",
      baseHref: "/sales",
      icon: <BadgeDollarSign size={20} />,
    },
    {
      title: "Payments",
      href: "/app/payments",
      baseHref: "/app/payments",
      icon: <DollarSignIcon size={20} />,
    },
    {
      title: "Links",
      href: "/app/links",
      baseHref: "/app/links",
      icon: <Link size={20} />,
    },
    {
      title: "Settings",
      href: "/app/settings",
      baseHref: "/app/settings",
      icon: <SettingsIcon size={20} />,
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-64 fixed top-0 h-full z-50">
        <SideNav items={navItems} storeUrl={authDetails.storeUrl} />
        <Separator orientation="vertical" />
      </div>
      <div className="flex flex-col md:pl-64 h-screen pb-20 md:pb-0 w-full">
        {children}
      </div>
      <div className="md:hidden w-full">
        <BottomBar items={navItems} storeUrl={authDetails.storeUrl} />
      </div>
    </div>
  );
}
