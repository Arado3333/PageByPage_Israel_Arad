"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Card from "./shared/Card";

export default function WritingStreakSection({ writingStreakPromise }) {
  const writingStreak = use(writingStreakPromise);
  const router = useRouter();

  const handleStartSprint = () => {
    // Navigate to clean editor for writing sprint
    router.push("/book-editor-v2");
  };

  return (
    <div className="sm:col-span-1 lg:col-span-4 xl:col-span-4 h-full">
      <Card title="Writing Streak" className="h-full">
        <div className="flex flex-col justify-center items-center h-full text-center">
          <div className="w-full">
            <div className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-amber-600 mb-2">
              {writingStreak.currentStreak}
            </div>
            <div className="text-sm 2xl:text-base 3xl:text-lg text-amber-700 mb-3">
              {writingStreak.currentStreak > 1 ? "days" : "day"}
            </div>

            {/* Days Indicator */}
            <div className="flex justify-center items-center gap-1 2xl:gap-2 mb-4">
              {writingStreak.lastWeek.map((dayData, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-xs 2xl:text-sm text-slate-500 mb-1">
                    {dayData.dayName}
                  </div>
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 rounded-full flex items-center justify-center ${
                      dayData.hasWritten
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {dayData.hasWritten ? (
                      <svg
                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 2xl:w-4 2xl:h-4 3xl:w-5 3xl:h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 2xl:w-1.5 2xl:h-1.5 3xl:w-2 3xl:h-2 rounded-full bg-slate-300"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs sm:text-sm 2xl:text-base 3xl:text-lg text-amber-700/90 mb-4 px-2">
              {writingStreak.currentStreak > 1 ? (
                <>
                  🎉 Amazing! You've written for {writingStreak.currentStreak}{" "}
                  days in a row!
                </>
              ) : writingStreak.currentStreak === 1 ? (
                <>Great start! Keep it going with a 5‑min sprint</>
              ) : (
                <>Start your writing streak today!</>
              )}
            </div>
            <button
              onClick={handleStartSprint}
              className="w-full max-w-32 2xl:max-w-40 3xl:max-w-48 mx-auto rounded-xl bg-amber-600 text-white py-2 px-3 2xl:py-3 2xl:px-4 3xl:py-4 3xl:px-6 text-xs sm:text-sm 2xl:text-base 3xl:text-lg hover:opacity-90 transition-opacity"
            >
              Start sprint
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
