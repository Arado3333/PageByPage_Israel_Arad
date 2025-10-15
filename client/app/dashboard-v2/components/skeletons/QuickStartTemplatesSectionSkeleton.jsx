import Card from "../shared/Card";

export default function QuickStartTemplatesSectionSkeleton() {
  return (
    <div className="w-full">
      <Card title="Quick Start Templates" actionLabel="Browse all">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 2xl:gap-6 3xl:gap-8">
          {[
            "Academic Essay",
            "Kids Story",
            "Research Notes",
            "Short Story",
          ].map((t, i) => (
            <div
              key={t}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 sm:p-4 2xl:p-6 3xl:p-8"
            >
              <div className="h-12 sm:h-16 lg:h-20 2xl:h-24 3xl:h-28 w-full rounded-lg mb-2 sm:mb-3 2xl:mb-4 3xl:mb-6 bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="text-sm sm:text-base lg:text-lg 2xl:text-xl 3xl:text-2xl font-medium text-center text-slate-800 dark:text-slate-200">
                {t}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
