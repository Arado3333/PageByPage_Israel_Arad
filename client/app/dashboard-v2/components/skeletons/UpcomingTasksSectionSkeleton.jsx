import Card from "../shared/Card";

export default function UpcomingTasksSectionSkeleton() {
  return (
    <div className="w-full">
      <Card title="Upcoming Tasks" actionLabel="Manage all tasks">
        <div className="flex flex-wrap gap-2 2xl:gap-3 3xl:gap-4 mb-4">
          {["Outline Chapter 2", "Tag research notes", "Proof last scene"].map(
            (t) => (
              <div
                key={t}
                className="rounded-full bg-slate-200 h-8 sm:h-10 2xl:h-12 3xl:h-14 px-3 sm:px-4 2xl:px-5 3xl:px-6 animate-pulse"
                style={{ width: `${t.length * 0.8}rem` }}
              />
            )
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 2xl:gap-3 3xl:gap-4">
          <div className="flex-1 h-12 sm:h-14 2xl:h-16 3xl:h-18 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-12 sm:h-14 2xl:h-16 3xl:h-18 w-20 sm:w-24 2xl:w-28 3xl:w-32 bg-slate-200 rounded-xl animate-pulse sm:whitespace-nowrap" />
        </div>
      </Card>
    </div>
  );
}
