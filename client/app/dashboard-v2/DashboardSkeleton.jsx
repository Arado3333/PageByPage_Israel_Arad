"use client";

import PageTransition from "../components/PageTransition";
import DailyGoalSkeleton from "./DailyGoalSkeleton";

export default function DashboardSkeleton() {
  return (
    <PageTransition>
      <div className="min-h-screen text-slate-800">
        {/* Decorative blobs */}
        <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
        </div>

        <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16">
          {/* Hero */}
          <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
              <div className="lg:col-span-8 xl:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 h-6 w-32 animate-pulse" />
                <div className="mt-2 h-8 sm:h-10 lg:h-12 xl:h-14 2xl:h-16 3xl:h-18 w-64 sm:w-80 lg:w-96 xl:w-[28rem] 2xl:w-[32rem] 3xl:w-[36rem] bg-slate-200 rounded animate-pulse" />
                <div className="mt-1 h-6 sm:h-7 2xl:h-8 3xl:h-9 w-48 sm:w-64 2xl:w-80 3xl:w-96 bg-slate-200 rounded animate-pulse" />
                <div className="mt-4 sm:mt-5 2xl:mt-8 3xl:mt-10 flex flex-wrap items-center gap-2 sm:gap-3 2xl:gap-4 3xl:gap-6">
                  <div className="h-10 sm:h-12 lg:h-14 2xl:h-16 3xl:h-18 w-32 sm:w-36 lg:w-40 2xl:w-44 3xl:w-48 bg-slate-200 rounded-2xl animate-pulse" />
                  <div className="h-10 sm:h-12 lg:h-14 2xl:h-16 3xl:h-18 w-24 sm:w-28 lg:w-32 2xl:w-36 3xl:w-40 bg-slate-200 rounded-2xl animate-pulse" />
                  <div className="h-10 sm:h-12 lg:h-14 2xl:h-16 3xl:h-18 w-28 sm:w-32 lg:w-36 2xl:w-40 3xl:w-44 bg-slate-200 rounded-2xl animate-pulse" />
                  <div className="h-10 sm:h-12 lg:h-14 2xl:h-16 3xl:h-18 w-32 sm:w-36 lg:w-40 2xl:w-44 3xl:w-48 bg-slate-200 rounded-2xl animate-pulse" />
                </div>
              </div>
              <div className="lg:col-span-4 xl:col-span-4">
                <DailyGoalSkeleton />
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-8 2xl:space-y-12 3xl:space-y-16 w-full">
            {/* Row 1 - Stats (spanning horizontally under hero) */}
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 2xl:gap-6 3xl:gap-8">
                {[
                  { label: "Books", color: "indigo" },
                  { label: "Drafts", color: "violet" },
                  { label: "Total words", color: "emerald" },
                  { label: "Chapters", color: "amber" },
                ].map((x) => (
                  <div
                    key={x.label}
                    className={`rounded-xl bg-white p-4 sm:p-6 2xl:p-8 3xl:p-10 ring-1 ring-slate-200 border-l-4 border-${x.color}-500`}
                  >
                    <div className="text-sm 2xl:text-base 3xl:text-lg text-slate-500">
                      {x.label}
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-semibold text-slate-800">
                      <div className="h-8 sm:h-10 lg:h-12 xl:h-14 2xl:h-16 3xl:h-18 w-16 sm:w-20 lg:w-24 xl:w-28 2xl:w-32 3xl:w-36 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 - Recent Drafts and Writing Streak */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
              {/* Recent Drafts */}
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
                          className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 2xl:p-6 3xl:p-8 mb-3 2xl:mb-4 3xl:mb-6 flex items-center gap-3 2xl:gap-4 3xl:gap-6"
                        >
                          <div className="h-8 w-8 2xl:h-10 2xl:w-10 3xl:h-12 3xl:w-12 rounded-lg bg-slate-200 animate-pulse" />
                          <div className="min-w-0 flex-1">
                            <div className="h-4 sm:h-5 2xl:h-6 3xl:h-7 w-32 sm:w-40 2xl:w-48 3xl:w-56 bg-slate-200 rounded animate-pulse mb-1 2xl:mb-2" />
                            <div className="h-3 sm:h-4 2xl:h-5 3xl:h-6 w-24 sm:w-32 2xl:w-40 3xl:w-48 bg-slate-200 rounded animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Writing Streak */}
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
                            <div
                              key={day}
                              className="flex flex-col items-center"
                            >
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
            </div>

            {/* Row 3 - AI Suggestions (spanning horizontally) */}
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
                      className="rounded-xl bg-slate-200 h-8 sm:h-10 2xl:h-12 3xl:h-14 px-2 sm:px-3 2xl:px-4 3xl:px-6 animate-pulse"
                      style={{ width: `${s.length * 0.8}rem` }}
                    />
                  ))}
                </div>
                <div className="rounded-xl border border-slate-200 p-3 sm:p-4 2xl:p-6 3xl:p-8 text-base 2xl:text-lg 3xl:text-xl text-slate-700 bg-gradient-to-br from-white to-emerald-50/40">
                  <div className="font-medium mb-2 2xl:mb-3">Preview</div>
                  <div className="space-y-2 2xl:space-y-3">
                    <div className="h-4 sm:h-5 2xl:h-6 3xl:h-7 w-full bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 sm:h-5 2xl:h-6 3xl:h-7 w-3/4 bg-slate-200 rounded animate-pulse" />
                  </div>
                  <div className="flex flex-wrap gap-2 2xl:gap-3 3xl:gap-4 mt-4">
                    <div className="h-8 sm:h-10 2xl:h-12 3xl:h-14 w-20 sm:w-24 2xl:w-28 3xl:w-32 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="h-8 sm:h-10 2xl:h-12 3xl:h-14 w-20 sm:w-24 2xl:w-28 3xl:w-32 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="h-8 sm:h-10 2xl:h-12 3xl:h-14 w-24 sm:w-28 2xl:w-32 3xl:w-36 bg-slate-200 rounded-xl animate-pulse" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Row 4 - Upcoming Tasks */}
            <div className="w-full">
              <Card title="Upcoming Tasks" actionLabel="Manage all tasks">
                <div className="flex flex-wrap gap-2 2xl:gap-3 3xl:gap-4 mb-4">
                  {[
                    "Outline Chapter 2",
                    "Tag research notes",
                    "Proof last scene",
                  ].map((t) => (
                    <div
                      key={t}
                      className="rounded-full bg-slate-200 h-8 sm:h-10 2xl:h-12 3xl:h-14 px-3 sm:px-4 2xl:px-5 3xl:px-6 animate-pulse"
                      style={{ width: `${t.length * 0.8}rem` }}
                    />
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 2xl:gap-3 3xl:gap-4">
                  <div className="flex-1 h-12 sm:h-14 2xl:h-16 3xl:h-18 bg-slate-200 rounded-xl animate-pulse" />
                  <div className="h-12 sm:h-14 2xl:h-16 3xl:h-18 w-20 sm:w-24 2xl:w-28 3xl:w-32 bg-slate-200 rounded-xl animate-pulse sm:whitespace-nowrap" />
                </div>
              </Card>
            </div>

            {/* Row 5 - Quick Start Templates */}
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
                      className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 2xl:p-6 3xl:p-8"
                    >
                      <div className="h-12 sm:h-16 lg:h-20 2xl:h-24 3xl:h-28 w-full rounded-lg mb-2 sm:mb-3 2xl:mb-4 3xl:mb-6 bg-slate-200 animate-pulse" />
                      <div className="text-sm sm:text-base lg:text-lg 2xl:text-xl 3xl:text-2xl font-medium text-center">
                        {t}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section className="mt-8 2xl:mt-12 3xl:mt-16 text-center text-xs 2xl:text-sm 3xl:text-base text-slate-500 w-full">
            <span>
              Tip: Hit ⌘K to run commands. Celebrate goal completion with a tiny
              confetti toast ✨
            </span>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

function Card({ title, actionLabel, children, className }) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-4 lg:p-5 xl:p-6 2xl:p-8 3xl:p-10 ${className}`}
    >
      <div className="mb-4 2xl:mb-6 3xl:mb-8 flex items-center justify-between">
        <h2 className="font-serif text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-[#0F1A2E]">
          {title}
        </h2>
        {actionLabel && (
          <button className="text-sm 2xl:text-base 3xl:text-lg text-[#0F1A2E] hover:opacity-80">
            {actionLabel} →
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
