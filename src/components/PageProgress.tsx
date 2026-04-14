"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setKey(prev => prev + 1);
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div 
      key={key} 
      className="page-progress"
      onAnimationEnd={() => setLoading(false)}
    />
  );
}
