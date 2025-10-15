"use client";

import React, { use } from "react";

export default function DailyGoalCard({ goalsPromise }) {
  const goals = use(goalsPromise);

  return (
    <div className="lg:col-span-4 xl:col-span-4">
      <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-800 border border-indigo-100 dark:border-indigo-800 p-4 sm:p-6 2xl:p-8 3xl:p-10 flex items-center gap-3 sm:gap-4 2xl:gap-6 3xl:gap-8 w-full">
        <div className="relative h-16 sm:h-18 2xl:h-20 3xl:h-24 w-16 sm:w-18 2xl:w-20 3xl:w-24 flex-shrink-0">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            {/* Background circle */}
            <path
              className="text-slate-200 dark:text-slate-700"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress circle */}
            <path
              className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-out"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={`${goals.percentage}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm sm:text-base 2xl:text-lg 3xl:text-xl font-medium text-indigo-700 dark:text-indigo-300">
            {goals.percentage}%
          </div>
        </div>
        <div>
          <div className="text-sm 2xl:text-base 3xl:text-lg text-indigo-700/90 dark:text-indigo-300/90">
            Daily goal
          </div>
          <div className="font-medium text-indigo-800 dark:text-indigo-200 text-base 2xl:text-lg 3xl:text-xl">
            {goals.current} / {goals.target} words
          </div>
          <div className="text-sm 2xl:text-base 3xl:text-lg text-indigo-700/80 dark:text-indigo-300/80">
            One mini‑scene will do ✍️
          </div>
        </div>
      </div>
    </div>
  );
}
