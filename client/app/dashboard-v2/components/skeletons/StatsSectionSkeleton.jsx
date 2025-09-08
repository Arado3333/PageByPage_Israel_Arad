export default function StatsSectionSkeleton() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 2xl:gap-6 3xl:gap-8">
        {[
          { label: "Books", color: "indigo" },
          { label: "Drafts", color: "violet" },
          { label: "Total words", color: "emerald" },
          { label: "Chapters", color: "amber" },
        ].map((x) => (
          <div
            key={x.label}
            className={`rounded-xl bg-white p-4 sm:p-6 2xl:p-8 3xl:p-10 ring-1 ring-slate-200 border-l-4 border-${x.color}-500`}
          >
            <div className="text-sm 2xl:text-base 3xl:text-lg text-slate-500">
              {x.label}
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-semibold text-slate-800">
              <div className="h-8 sm:h-10 lg:h-12 xl:h-14 2xl:h-16 3xl:h-18 w-16 sm:w-20 lg:w-24 xl:w-28 2xl:w-32 3xl:w-36 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
