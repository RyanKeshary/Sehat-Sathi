export default function ClinicLoading() {
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
          <div key={i} className="h-28 bg-white border border-sky-100 rounded-2xl p-4">
            <div className="h-3 w-16 bg-sky-50 rounded mb-2" />
            <div className="h-7 w-14 bg-sky-100 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="h-[400px] bg-white border border-sky-100 rounded-2xl" />
    </div>
  );
}
