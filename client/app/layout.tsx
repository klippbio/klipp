// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import QueryWrapper from "./components/QueryWrapper";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./components/AuthContext";


export const metadata = {
  title: {
    default: "klipp",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <html lang="en">
          <body className={inter.className}>
            <QueryWrapper>
              <Toaster />
              {children}
            </QueryWrapper>
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  );
}
