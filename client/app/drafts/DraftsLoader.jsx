export default function DraftsLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className="group rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 flex flex-col h-full overflow-hidden animate-pulse"
        >
          {/* Gradient Header Skeleton */}
          <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-300" />

          <div className="p-4 sm:p-6 2xl:p-8 3xl:p-10 flex-1 flex flex-col">
            {/* Title and Status Skeleton */}
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-200 rounded w-32 h-6" />
              <div className="bg-slate-100 rounded-full w-16 h-5" />
            </div>

            {/* Content Snippet Skeleton */}
            <div className="space-y-2 mb-6">
              <div className="bg-slate-100 rounded w-full h-4" />
              <div className="bg-slate-100 rounded w-3/4 h-4" />
              <div className="bg-slate-100 rounded w-1/2 h-4" />
            </div>

            {/* Meta Information Skeleton */}
            <div className="space-y-3 text-sm flex-1 mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-slate-200 rounded w-4 h-4" />
                <div className="bg-indigo-100 rounded-lg w-24 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-slate-200 rounded w-4 h-4" />
                <div className="bg-slate-100 rounded-lg w-20 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-slate-200 rounded w-4 h-4" />
                <div className="bg-slate-100 rounded-lg w-24 h-5" />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-full h-10" />
              <div className="bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-full h-10" />
              <div className="bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-full h-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
