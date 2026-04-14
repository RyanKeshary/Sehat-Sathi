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
import ClientOnly from "@/components/shared/ClientOnly";
import ViewportHeightProvider from "@/components/providers/ViewportHeightProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-devanagari",
  weight: ["400", "500", "700", "800"],
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 1. Immobilize Web3 Providers with a "Safe" Dummy
                const block = () => {
                  try {
                    const safeProvider = {
                      request: async () => [],
                      on: () => {},
                      once: () => {},
                      off: () => {},
                      removeListener: () => {},
                      addListener: () => {},
                      emit: () => {},
                      isMetaMask: true, // Some libraries check this before calling
                      isConnected: () => false,
                      enable: async () => [],
                      send: async () => ({}),
                      sendAsync: (payload, cb) => cb(null, {}),
                      selectedAddress: null,
                      networkVersion: null,
                      chainId: null,
                    };

                    const config = { value: safeProvider, writable: false, configurable: false };
                    Object.defineProperty(window, 'ethereum', config);
                    Object.defineProperty(window, 'web3', config);
                    Object.defineProperty(window, 'Web3', config);
                  } catch (e) {}
                };
                block();

                // 2. Muzzle MetaMask Extension Errors & System Logs
                const SILENCE_PATTERNS = [
                  'MetaMask', 
                  'nkbihfbeogaeaoehlefnkodbefgpgknn', 
                  'Failed to connect to MetaMask',
                  'inpage.js',
                  'eth_requestAccounts',
                  'eth_accounts',
                  'eth_chainId',
                  'unhandledRejection: i:',
                  'unhandledRejection: Error: i:'
                ];

                const shouldSilence = (arg) => {
                  try {
                    if (!arg) return false;
                    const msg = arg.message || arg.stack || (typeof arg === 'string' ? arg : '');
                    const str = String(msg) + (arg.reason ? String(arg.reason) : '') + (JSON.stringify(arg) || '');
                    return SILENCE_PATTERNS.some(p => str.includes(p));
                  } catch {
                    return false;
                  }
                };

                // Override Console to prevent log pollution
                ['error', 'warn', 'info', 'log'].forEach(method => {
                  const original = console[method];
                  console[method] = function(...args) {
                    if (args.some(shouldSilence)) return;
                    original.apply(console, args);
                  };
                });

                // 3. Global Exception Catchers (Prevents Next.js Overlay & Terminal Logs)
                const quietError = (event) => {
                  if (shouldSilence(event.error) || shouldSilence(event.reason) || shouldSilence(event.message)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return true;
                  }
                };

                window.addEventListener('error', quietError, true);
                window.addEventListener('unhandledrejection', quietError, true);

                // Manual property assignment for extra durability
                window.onerror = (msg, url, line, col, error) => {
                  if (shouldSilence(msg) || shouldSilence(error)) return true;
                };
                window.onunhandledrejection = (event) => {
                  if (shouldSilence(event.reason)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return true;
                  }
                };

                // 4. Persistent Blocking
                window.addEventListener('load', block);
                document.addEventListener('DOMContentLoaded', block);
                
                // MutationObserver to catch late injections
                new MutationObserver(() => block()).observe(document.documentElement, { attributes: true, childList: true, subtree: true });
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoDevanagari.variable} font-sans bg-[#060F1E] text-white antialiased selection:bg-[#00C896]/30`}
      >
        <CursorSpotlight />
        <ViewportHeightProvider />
        <GoogleTranslateWidget />
        <LanguagePersistence />
        <QueryProvider>
          <LanguageProvider>
            <PWAProvider>
              <SmoothScrollProvider>
                <div className="flex flex-col min-h-screen">
                  <ClientOnly>
                    <Navbar />
                  </ClientOnly>
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
