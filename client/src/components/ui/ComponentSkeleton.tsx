import React from "react";
import { Loader2 } from "lucide-react";

export default function ComponentSkeleton() {
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-white/10 animate-pulse">
      <Loader2 className="w-10 h-10 text-[#00C896] animate-spin mb-4" />
      <div className="w-32 h-4 bg-white/10 rounded-full" />
    </div>
  );
}
