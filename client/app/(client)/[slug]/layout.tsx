import { ScrollArea } from "@/components/ui/scroll-area";
import SidePanel from "./[productId]/sidePanel";

interface DigitalDownloadsLayoutProps {
  children: React.ReactNode;
}

export default function DigitalDownloadsLayout({
  children,
}: DigitalDownloadsLayoutProps) {
  return (
    <div className="h-screen w-screen flex justify-between lg:flex-row">
      <div className="lg:flex hidden lg:w-1/3">
        <SidePanel />
      </div>
      <div className="flex flex-col h-screen w-full md:pb-0 lg:w-2/3 overflow-hidden ">
        <ScrollArea>{children}</ScrollArea>
      </div>
    </div>
  );
}
