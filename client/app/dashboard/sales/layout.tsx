export default function SaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full pt-24 px-4 md:px-8 overflow-hidden ">{children}</div>
  );
}
