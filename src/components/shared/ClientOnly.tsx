"use client";

import React, { useEffect, useState } from "react";

/**
 * A utility component that prevents its children from being rendered on the server.
 * Use this to wrap components that cause persistent hydration mismatches due to
 * non-deterministic attributes, browser extensions, or complex animations.
 */
export default function ClientOnly({ children, fallback = null }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
