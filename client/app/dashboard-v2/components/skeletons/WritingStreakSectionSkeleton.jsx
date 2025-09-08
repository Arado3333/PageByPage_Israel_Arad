import Card from "../shared/Card";

export default function WritingStreakSectionSkeleton() {
  return (
    <div className="sm:col-span-1 lg:col-span-4 xl:col-span-4 h-full">
      <Card
        title="Writing Streak"
        actionLabel="View details"
        className="h-full"
      >
        <div className="flex flex-col justify-center items-center h-full text-center">
          <div className="w-full">
            <div className="h-8 sm:h-10 lg:h-12 2xl:h-14 3xl:h-16 w-16 sm:w-20 lg:w-24 2xl:w-28 3xl:w-32 bg-slate-200 rounded animate-pulse mx-auto mb-2" />
            <div className="text-sm 2xl:text-base 3xl:text-lg text-slate-500 mb-3">
              days
            </div>

            {/* Days Indicator */}
            <div className="flex justify-center items-center gap-1 2xl:gap-2 mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, index) => (
                  <div key={day} className="flex flex-col items-center">
                    <div className="text-xs 2xl:text-sm text-slate-500 mb-1">
                      {day}
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 rounded-full bg-slate-200 animate-pulse" />
                  </div>
                )
              )}
            </div>

            <div className="text-xs sm:text-sm 2xl:text-base 3xl:text-lg text-slate-500 mb-4 px-2">
              Keep it going with a 5‑min sprint
            </div>
            <div className="w-full max-w-32 2xl:max-w-40 3xl:max-w-48 mx-auto h-8 sm:h-10 2xl:h-12 3xl:h-14 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
}
