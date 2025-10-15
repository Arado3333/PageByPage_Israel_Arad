import Card from "../shared/Card";

export default function RecentDraftsSectionSkeleton() {
  return (
    <div className="sm:col-span-2 lg:col-span-8 xl:col-span-8 h-full">
      <Card
        title="Recent Drafts"
        actionLabel="View all drafts"
        className="h-full"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-5 2xl:p-6 3xl:p-8 mb-3 2xl:mb-4 3xl:mb-6 flex items-center gap-3 2xl:gap-4 3xl:gap-6"
              >
                <div className="h-8 w-8 2xl:h-10 2xl:w-10 3xl:h-12 3xl:w-12 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="min-w-0 flex-1">
                  <div className="h-4 sm:h-5 2xl:h-6 3xl:h-7 w-32 sm:w-40 2xl:w-48 3xl:w-56 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1 2xl:mb-2" />
                  <div className="h-3 sm:h-4 2xl:h-5 3xl:h-6 w-24 sm:w-32 2xl:w-40 3xl:w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
