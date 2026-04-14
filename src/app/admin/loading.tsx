export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#FAFCFF] p-8 animate-pulse">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-sky-100 rounded-xl" />
        <div className="space-y-2">
          <div className="h-5 w-48 bg-sky-100 rounded-lg" />
          <div className="h-3 w-32 bg-sky-50 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-32 bg-white border border-sky-100 rounded-3xl" />
        ))}
      </div>
      <div className="h-[500px] bg-white border border-sky-100 rounded-3xl" />
    </div>
  );
}
