import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Abba Emi Ruchi Andi | Authentic Telugu Pickles & Podis",
  description: "Homemade, authentic Telugu flavors delivered to your doorstep. Amma's touch in every jar.",
};

import Link from "next/link";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased selection:bg-brand-saffron/30`}>
        {/* Background Fade Logo */}
        <div className="fixed inset-0 pointer-events-none -z-1 overflow-hidden opacity-[0.03]">
          <div className="absolute top-[10%] -left-[5%] w-[600px] h-[600px] rotate-[-15deg]">
            <Image 
              src="/logo.png" 
              alt="" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-[10%] -right-[5%] w-[800px] h-[800px] rotate-[15deg]">
            <Image 
              src="/logo.png" 
              alt="" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        <div className="relative min-h-screen">
          {children}
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
