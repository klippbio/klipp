import SidePanel from "./components/sidePanel";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen  justify-between md:flex overflow-y-auto md:overflow-hidden">
      <div className="md:w-1/3 w-full">
        <SidePanel />
      </div>
      <div className="flex flex-col h-screen pb-20 w-full md:pb-0 xl:w-2/3 md:overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
