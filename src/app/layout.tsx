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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <div className="min-h-screen bg-brand-cream/30">
          {children}
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
