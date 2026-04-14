import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import PWAProvider from "@/components/providers/PWAProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import ToastContainer from "@/components/ui/ToastContainer";
import OfflineBanner from "@/components/ui/OfflineBanner";
import Navbar from "@/components/navigation/Navbar";
import GoogleTranslateWidget from "@/components/navigation/GoogleTranslateWidget";
import LanguagePersistence from "@/components/navigation/LanguagePersistence";
import PageTransitionWrapper from "@/components/providers/PageTransitionWrapper";
import BackToTop from "@/components/ui/BackToTop";
import CursorSpotlight from "@/components/ui/CursorSpotlight";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-devanagari",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sehat Sathi | Healthcare Reaches Every Corner of India",
  description: "Connect with certified doctors via video, check symptoms in your language with AI, and access your health records — even without internet. Serving rural India.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sehat Sathi",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A2540",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoDevanagari.variable} font-sans bg-[#060F1E] text-white antialiased selection:bg-[#00C896]/30`}
      >
        <CursorSpotlight />
        <GoogleTranslateWidget />
        <LanguagePersistence />
        <QueryProvider>
          <LanguageProvider>
            <PWAProvider>
              <SmoothScrollProvider>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1 flex flex-col relative z-0">
                    <PageTransitionWrapper>
                      {children}
                    </PageTransitionWrapper>
                  </main>
                  <ToastContainer />
                  <OfflineBanner />
                  <BackToTop />
                </div>
              </SmoothScrollProvider>
            </PWAProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
