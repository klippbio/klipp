import { ScrollArea } from "@/components/ui/scroll-area";
import SidePanel from "./components/sidePanel";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen  justify-between md:flex">
      <div className="md:w-1/3 w-full">
        <SidePanel />
      </div>
      <div className="flex flex-col h-screen pb-20 w-full md:pb-0 xl:w-2/3 overflow-hidden ">
        <ScrollArea>{children}</ScrollArea>
      </div>
    </div>
  );
}
