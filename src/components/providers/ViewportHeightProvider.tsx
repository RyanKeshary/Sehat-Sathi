"use client";

import { useViewportHeight } from "@/hooks/useViewportHeight";

/**
 * Client component that runs the viewport height CSS custom property
 * updater. Must be included in the root layout.
 */
export default function ViewportHeightProvider() {
  useViewportHeight();
  return null;
}
