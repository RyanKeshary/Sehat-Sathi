export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFCFF] p-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sky-100 rounded-xl" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-sky-100 rounded-lg" />
            <div className="h-3 w-32 bg-sky-50 rounded" />
          </div>
        </div>
        <div className="h-10 w-32 bg-sky-100 rounded-xl" />
      </div>

      {/* KPI Row skeleton */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-white border border-sky-100 rounded-2xl p-5">
            <div className="h-3 w-20 bg-sky-50 rounded mb-3" />
            <div className="h-7 w-16 bg-sky-100 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="bg-white border border-sky-100 rounded-2xl p-6">
        <div className="h-4 w-40 bg-sky-100 rounded mb-6" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-sky-50 last:border-0">
            <div className="w-12 h-12 bg-sky-50 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-sky-50 rounded" />
              <div className="h-3 w-1/2 bg-sky-50/50 rounded" />
            </div>
            <div className="h-8 w-20 bg-sky-100 rounded-lg" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-pulse > div {
          background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
