export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-svh md:h-screen w-screen ">{children}</div>;
}
