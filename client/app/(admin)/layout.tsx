// app/layout.tsx
import "../globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { SideNav } from "../components/sideNav";
import { Separator } from "@/components/ui/separator";
import { BottomBar } from "../components/bottomBar";
import { LayoutDashboardIcon } from "lucide-react/";
import { ShoppingBasketIcon } from "lucide-react";
import { WrapText } from "lucide-react/";
import TopBar from "../components/topBar";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "My Products",
    href: "/products",
    icon: <ShoppingBasketIcon />,
  },
  {
    title: "My Page",
    href: "/mypage",
    icon: <WrapText />,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-72">
        <SideNav items={navItems} />
      </div>
      <Separator orientation="vertical" className="hidden md:block" />
      <div className="flex flex-col h-screen pb-20 md:pb-0 w-full ">
        <TopBar />
        <Separator orientation="horizontal" />
        {children}
      </div>
      <div className="md:hidden w-full">
        <BottomBar items={navItems} />
      </div>
    </div>
  );
}
