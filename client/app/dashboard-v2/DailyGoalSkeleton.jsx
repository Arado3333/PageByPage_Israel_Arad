import React from "react";

export default function DailyGoalSkeleton() {
  return (
    <div className="lg:col-span-4 xl:col-span-4">
      <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-4 sm:p-6 2xl:p-8 3xl:p-10 flex items-center gap-3 sm:gap-4 2xl:gap-6 3xl:gap-8 w-full">
        <div className="relative h-16 sm:h-18 2xl:h-20 3xl:h-24 w-16 sm:w-18 2xl:w-20 3xl:w-24 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border-4 border-white shadow-inner" />
          <div className="absolute inset-0 rounded-full bg-slate-200 animate-pulse" />
          <div className="absolute inset-1 rounded-full bg-white" />
          <div className="absolute inset-0 flex items-center justify-center text-sm sm:text-base 2xl:text-lg 3xl:text-xl font-medium text-slate-400">
            --
          </div>
        </div>
        <div>
          <div className="text-sm 2xl:text-base 3xl:text-lg text-indigo-700/90">
            Daily goal
          </div>
          <div className="font-medium text-indigo-800 text-base 2xl:text-lg 3xl:text-xl">
            -- / -- words
          </div>
          <div className="text-sm 2xl:text-base 3xl:text-lg text-indigo-700/80">
            One mini‑scene will do ✍️
          </div>
        </div>
      </div>
    </div>
  );
}
