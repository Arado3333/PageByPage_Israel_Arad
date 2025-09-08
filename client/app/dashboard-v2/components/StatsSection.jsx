"use client";

import { use } from "react";

export default function StatsSection({ statsPromise }) {
  const stats = use(statsPromise);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 2xl:gap-6 3xl:gap-8">
        {[
          { label: "Books", value: stats.totalBooks, color: "indigo" },
          { label: "Drafts", value: stats.totalDrafts, color: "violet" },
          {
            label: "Total words",
            value: stats.totalWords,
            color: "emerald",
          },
          {
            label: "Chapters",
            value: stats.chaptersCompleted,
            color: "amber",
          },
        ].map((x) => (
          <div
            key={x.label}
            className={`rounded-xl bg-white p-4 sm:p-6 2xl:p-8 3xl:p-10 ring-1 ring-slate-200 border-l-4 border-${x.color}-500`}
          >
            <div className="text-sm 2xl:text-base 3xl:text-lg text-slate-500">
              {x.label}
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-semibold text-slate-800">
              {x.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
