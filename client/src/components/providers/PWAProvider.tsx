"use client";

import React, { useEffect } from "react";
import { useToastStore } from "@/store/useToastStore";

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const { addToast } = useToastStore();

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered:", registration);
            
            // Check for update
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              newWorker?.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  addToast("Update available! Reload to apply.", "info");
                }
              });
            });
          })
          .catch((error) => {
            console.error("SW registration failed:", error);
          });
      });
    }
  }, [addToast]);

  return <>{children}</>;
}
