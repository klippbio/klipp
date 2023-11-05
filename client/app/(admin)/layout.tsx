// app/layout.tsx
import "../globals.css";
import { SideNav } from "../components/sideNav";
import { Separator } from "@/components/ui/separator";
import { BottomBar } from "../components/bottomBar";
import { FileCheck2 } from "lucide-react/";
import TopBar from "../components/topBar";
import { HomeIcon } from "lucide-react/";
import { Calendar } from "lucide-react/";
import { Server } from "lucide-react/";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  {
    title: "Home",
    href: "/home",
    icon: <HomeIcon size={20} />,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: <Calendar size={20} />,
  },
  {
    title: "Store",
    href: "/store",
    icon: <Server size={20} />,
  },
  {
    title: "Digital Products",
    href: "/digital-downloads",
    icon: <FileCheck2 size={20} />,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-64">
        <SideNav items={navItems} />
      </div>
      <Separator orientation="vertical" className="hidden md:block" />
      <div className="flex flex-col h-screen pb-20 md:pb-0 w-full overflow-hidden ">
        <TopBar />
        <Separator orientation="horizontal" />
        <ScrollArea>{children}</ScrollArea>
      </div>
      <div className="md:hidden w-full">
        <BottomBar items={navItems} />
      </div>
    </div>
  );
}
