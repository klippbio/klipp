import { PHProvider } from "../providers";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-svh md:h-screen w-screen ">
      <PHProvider>{children}</PHProvider>
    </div>
  );
}
