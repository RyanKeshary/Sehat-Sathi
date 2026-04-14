import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sehat Sathi - Healthcare Excellence for all",
  description: "Healthcare that reaches every corner of India. Offline-first, ABHA integrated, and DPDPA compliant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-[#FAFCFF] text-[#475569]`}>
        {children}
      </body>
    </html>
  );
}
