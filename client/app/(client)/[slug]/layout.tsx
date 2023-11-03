import { ScrollArea } from "@/components/ui/scroll-area";
import SidePanel from "./[productId]/sidePanel";

interface DigitalDownloadsLayoutProps {
  children: React.ReactNode;
}

export default function DigitalDownloadsLayout({
  children,
}: DigitalDownloadsLayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      <div className="md:flex hidden md:w-1/3">
        <SidePanel />
      </div>
      <div className="flex flex-col h-screen pb-20 md:pb-0 md:w-2/3 overflow-hidden ">
        <ScrollArea>{children}</ScrollArea>
      </div>
    </div>
  );
}
