// import Nav from "../components/sideNav";

export default function OnboardingLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
