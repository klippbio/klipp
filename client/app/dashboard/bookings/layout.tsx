export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full pt-16 md:pt-4 px-4 md:px-8 pb-10 overflow-y-auto">
      {children}
    </div>
  );
}
