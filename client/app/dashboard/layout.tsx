import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "../components/sidebarNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <section>{children}</section>;
}
