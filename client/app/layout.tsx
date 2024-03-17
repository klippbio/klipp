// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import QueryWrapper from "./components/QueryWrapper";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./components/AuthContext";
import { PHProvider } from "./providers";

export const metadata = {
  title: {
    default: "klipp",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  description: {
    default:
      "Launch your digital store in 5 minutes. Sell digital products, schedule meetings, offer coaching, and consolidate links in your link-in-bio store. Your one-stop monetization platform.",
  },
  openGraph: {
    title: "klipp",
    description:
      "Launch your digital store in 5 minutes. Sell digital products, schedule meetings, offer coaching, and consolidate links in your link-in-bio store. Your one-stop monetization platform.",
    type: "article",
    images: [
      {
        url: "https://www.klipp.io/logoBanner.png",
        width: 1200,
        height: 630,
        alt: "klipp",
      },
    ],
  },
  twitter: {
    title: "klipp",
    description:
      "Launch your digital store in 5 minutes. Sell digital products, schedule meetings, offer coaching, and consolidate links in your link-in-bio store. Your one-stop monetization platform.",
    type: "article",
    images: [
      {
        url: "https://www.klipp.io/logoBanner.png",
        width: 1200,
        height: 630,
        alt: "klipp",
      },
    ],
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
        <PHProvider>
          <html lang="en">
            <body className={inter.className}>
              <QueryWrapper>
                <Toaster />
                {children}
              </QueryWrapper>
            </body>
          </html>
        </PHProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
