export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full pt-36 px-4 md:px-8 overflow-hidden ">{children}</div>
  );
}
