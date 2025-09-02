import { Sparkles } from "lucide-react";


export default function LibraryLoader() {
  // Pure skeleton loader for library grid
  return (
    <div className="min-h-screen text-slate-800">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-30" />
      </div>

      <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16">
        {/* Hero Section Skeleton */}
        <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg">
              <Sparkles className="w-4 h-4" />
              Your Library
            </div>
            <div className="h-10 w-32 bg-gradient-to-r from-indigo-700 to-violet-700 rounded-xl animate-pulse" />
          </div>

          <div className="h-8 sm:h-10 lg:h-12 xl:h-14 2xl:h-16 3xl:h-18 bg-slate-200 rounded-lg mb-2 animate-pulse" />
          <div className="h-6 sm:h-7 2xl:h-8 3xl:h-9 bg-slate-200 rounded-lg mb-6 w-3/4 animate-pulse" />

          {/* Search and Filter Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
              <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </section>

        {/* Books Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="group rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 flex flex-col h-full overflow-hidden animate-pulse"
            >
              {/* Gradient Header Skeleton */}
              <div
                className={`h-2 bg-gradient-to-r ${
                  [
                    "from-indigo-300 to-indigo-500",
                    "from-pink-300 to-rose-500",
                    "from-emerald-300 to-teal-500",
                    "from-violet-300 to-purple-500",
                    "from-amber-300 to-orange-500",
                    "from-cyan-300 to-blue-500",
                  ][index % 6]
                }`}
              />

              <div className="p-4 sm:p-6 2xl:p-8 3xl:p-10 flex-1 flex flex-col">
                {/* Title and Status Skeleton */}
                <div className="flex justify-between items-start mb-4">
                  <div className="h-6 sm:h-7 lg:h-8 2xl:h-9 3xl:h-10 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
                  <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
                </div>

                {/* Tags Skeleton */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-6 w-14 bg-slate-200 rounded-full animate-pulse" />
                </div>

                {/* Stats Skeleton */}
                <div className="space-y-3 text-sm flex-1 mb-6">
                  {[...Array(4)].map((_, statIndex) => (
                    <div
                      key={statIndex}
                      className="flex justify-between items-center"
                    >
                      <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                      <div className="h-6 w-8 bg-slate-200 rounded-lg animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Action Buttons Skeleton */}
                <div className="space-y-3">
                  <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
                  <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
