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
  description: {
    default:
      "Turn Passion into Profit with your Digital Store Sell digital products, schedule meetings, offer coaching, and consolidate links in your link-in-bio store. Your one-stop monetization platform.",
  },
  openGraph: {
    title: "klipp",
    description:
      "Turn Passion into Profit with your Digital Store Sell digital products, schedule meetings, offer coaching, and consolidate links in your link-in-bio store. Your one-stop monetization platform.",
    type: "article",
    images: [
      {
        url: "https://www.klipp.io/logoText.jpg",
        width: 1200,
        height: 630,
        alt: "klipp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "klipp",
    description:
      "Turn Passion into Profit with your Digital Store Sell digital products, schedule meetings, offer coaching, and consolidate links in your link-in-bio store. Your one-stop monetization platform.",
    images: ["https://www.klipp.io/logoText.jpg"],
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
