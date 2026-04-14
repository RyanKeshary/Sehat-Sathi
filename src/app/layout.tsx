import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PageProgress } from "@/components/PageProgress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sehat Sathi — Healthcare for Every Corner of India",
  description: "India's offline-first rural telemedicine platform. ABHA integrated, DPDPA compliant, and built for Bharat.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sehat Sathi — Healthcare for Every Corner of India",
    description: "Offline-first, ABHA-integrated telemedicine for rural India.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0891B2" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#FAFCFF] text-[#475569]`}>
        <AuthProvider>
          <PageProgress />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
