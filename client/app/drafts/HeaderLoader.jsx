export default function HeaderLoader() {
  // Skeleton loader for Draft Manager header
  return (
    <div className="dm-header">
      {/* Decorative blobs skeleton */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-slate-200 blur-3xl opacity-40 animate-pulse" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-slate-200 blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-slate-200 blur-3xl opacity-30 animate-pulse" />
      </div>

      <div className="dm-header-content">
        {/* Hero Section Skeleton */}
        <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg animate-pulse">
              <div className="w-4 h-4 bg-slate-300 rounded" />
              <div className="w-20 h-4 bg-slate-300 rounded" />
            </div>
            <div className="w-32 h-10 bg-slate-200 rounded-xl animate-pulse" />
          </div>

          <div className="mb-6">
            <div className="w-64 h-12 bg-slate-200 rounded mb-2 animate-pulse" />
            <div className="w-80 h-6 bg-slate-200 rounded animate-pulse" />
          </div>

          {/* Search and Filter Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="w-full h-12 bg-slate-200 rounded-xl animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-300 rounded" />
              <div className="w-32 h-10 bg-slate-200 rounded-xl animate-pulse" />
              <div className="w-32 h-10 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
