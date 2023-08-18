import Verticle_Nav from "./components/Verticle_Nav";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Verticle_Nav />
      {children}
    </section>
  );
}
