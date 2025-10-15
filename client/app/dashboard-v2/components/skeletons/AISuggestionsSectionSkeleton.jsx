import Card from "../shared/Card";

export default function AISuggestionsSectionSkeleton() {
  return (
    <div className="w-full">
      <Card title="AI Suggestions" actionLabel="Get more AI help">
        <div className="flex flex-wrap gap-2 2xl:gap-3 3xl:gap-4 mb-4">
          {[
            "Add ambient detail",
            "Tighten dialogue",
            "Name generator",
            "Fix tense shifts",
            "Summarize chapter",
          ].map((s) => (
            <div
              key={s}
              className="rounded-xl bg-slate-200 dark:bg-slate-700 h-8 sm:h-10 2xl:h-12 3xl:h-14 px-2 sm:px-3 2xl:px-4 3xl:px-6 animate-pulse"
              style={{ width: `${s.length * 0.8}rem` }}
            />
          ))}
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 2xl:p-6 3xl:p-8 text-base 2xl:text-lg 3xl:text-xl text-slate-700 dark:text-slate-300 bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-800 dark:to-emerald-900/20">
          <div className="font-medium mb-2 2xl:mb-3">Preview</div>
          <div className="space-y-2 2xl:space-y-3">
            <div className="h-4 sm:h-5 2xl:h-6 3xl:h-7 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 sm:h-5 2xl:h-6 3xl:h-7 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2 2xl:gap-3 3xl:gap-4 mt-4">
            <div className="h-8 sm:h-10 2xl:h-12 3xl:h-14 w-20 sm:w-24 2xl:w-28 3xl:w-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="h-8 sm:h-10 2xl:h-12 3xl:h-14 w-20 sm:w-24 2xl:w-28 3xl:w-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="h-8 sm:h-10 2xl:h-12 3xl:h-14 w-24 sm:w-28 2xl:w-32 3xl:w-36 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
}
