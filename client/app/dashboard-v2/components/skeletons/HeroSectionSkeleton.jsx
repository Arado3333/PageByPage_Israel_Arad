import DailyGoalSkeleton from "../../DailyGoalSkeleton";

export default function HeroSectionSkeleton() {
  return (
    <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
        <div className="lg:col-span-8 xl:col-span-8">
          {/* Welcome badge skeleton */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 h-6 w-32 animate-pulse" />

          {/* Main heading skeleton */}
          <div className="mt-2 h-8 sm:h-10 lg:h-12 xl:h-14 2xl:h-16 3xl:h-18 w-64 sm:w-80 lg:w-96 xl:w-[28rem] 2xl:w-[32rem] 3xl:w-[36rem] bg-slate-200 rounded animate-pulse" />

          {/* Subtitle skeleton */}
          <div className="mt-1 h-6 sm:h-7 2xl:h-8 3xl:h-9 w-48 sm:w-64 2xl:w-80 3xl:w-96 bg-slate-200 rounded animate-pulse" />

          {/* Action buttons skeleton */}
          <div className="mt-4 sm:mt-5 2xl:mt-8 3xl:mt-10 flex flex-wrap items-center gap-2 sm:gap-3 2xl:gap-4 3xl:gap-6">
            <div className="h-10 sm:h-12 lg:h-14 2xl:h-16 3xl:h-18 w-32 sm:w-36 lg:w-40 2xl:w-44 3xl:w-48 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="h-10 sm:h-12 lg:h-14 2xl:h-16 3xl:h-18 w-24 sm:w-28 lg:w-32 2xl:w-36 3xl:w-40 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="h-10 sm:h-12 lg:h-14 2xl:h-16 3xl:h-18 w-28 sm:w-32 lg:w-36 2xl:w-40 3xl:w-44 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="h-10 sm:h-12 lg:h-14 2xl:h-16 3xl:h-18 w-32 sm:w-36 lg:w-40 2xl:w-44 3xl:w-48 bg-slate-200 rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* Daily Goal skeleton */}
        <div className="lg:col-span-4 xl:col-span-4">
          <DailyGoalSkeleton />
        </div>
      </div>
    </section>
  );
}
