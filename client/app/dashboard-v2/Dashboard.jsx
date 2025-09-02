"use client";

import PageTransition from "../components/PageTransition";

export default function Dashboard() {
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
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg">
                  ✨ Welcome back
                </div>
                <h1 className="mt-2 text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-serif text-[#0F1A2E]">
                  Pick up where you left off
                </h1>
                <p className="mt-1 text-base sm:text-lg 2xl:text-xl 3xl:text-2xl text-slate-600">
                  Resume{" "}
                  <span dir="auto" className="font-medium">
                    {
                      "\u05D4\u05E1\u05E4\u05E1\u05DC \u05E2\u05DC \u05D4\u05E9\u05D3\u05E8\u05D4"
                    }
                  </span>{" "}
                  — last edited 2h ago
                </p>
                <div className="mt-4 sm:mt-5 2xl:mt-8 3xl:mt-10 flex flex-wrap items-center gap-2 sm:gap-3 2xl:gap-4 3xl:gap-6">
                  <button className="rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-700 text-white px-3 sm:px-4 lg:px-5 2xl:px-6 3xl:px-8 py-2 lg:py-3 2xl:py-4 3xl:py-6 text-sm lg:text-base 2xl:text-lg 3xl:text-xl shadow-sm hover:opacity-90">
                    Resume writing
                  </button>
                  <button className="rounded-2xl border border-indigo-200 text-indigo-700 px-3 sm:px-4 lg:px-5 2xl:px-6 3xl:px-8 py-2 lg:py-3 2xl:py-4 3xl:py-6 text-sm lg:text-base 2xl:text-lg 3xl:text-xl hover:bg-indigo-50">
                    New draft
                  </button>
                  <button className="rounded-2xl border border-slate-300 px-3 sm:px-4 lg:px-5 2xl:px-6 3xl:px-8 py-2 lg:py-3 2xl:py-4 3xl:py-6 text-sm lg:text-base 2xl:text-lg 3xl:text-xl hover:bg-white">
                    Open Library
                  </button>
                  <button className="rounded-2xl border border-amber-300 text-amber-700 px-3 sm:px-4 lg:px-5 2xl:px-6 3xl:px-8 py-2 lg:py-3 2xl:py-4 3xl:py-6 text-sm lg:text-base 2xl:text-lg 3xl:text-xl hover:bg-amber-50">
                    Kids Story Mode
                  </button>
                </div>
              </div>
              {/* Daily Goal */}
              <div className="lg:col-span-4 xl:col-span-4">
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-4 sm:p-6 2xl:p-8 3xl:p-10 flex items-center gap-3 sm:gap-4 2xl:gap-6 3xl:gap-8 w-full">
                  <div className="relative h-16 sm:h-18 2xl:h-20 3xl:h-24 w-16 sm:w-18 2xl:w-20 3xl:w-24 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full border-4 border-white shadow-inner" />
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "conic-gradient(#4F46E5 0% 35%, #E5E7EB 35% 100%)",
                      }}
                    />
                    <div className="absolute inset-1 rounded-full bg-white" />
                    <div className="absolute inset-0 flex items-center justify-center text-sm sm:text-base 2xl:text-lg 3xl:text-xl font-medium text-indigo-700">
                      35%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm 2xl:text-base 3xl:text-lg text-indigo-700/90">
                      Daily goal
                    </div>
                    <div className="font-medium text-indigo-800 text-base 2xl:text-lg 3xl:text-xl">
                      16 / 47 words
                    </div>
                    <div className="text-sm 2xl:text-base 3xl:text-lg text-indigo-700/80">
                      One mini‑scene will do ✍️
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-8 2xl:space-y-12 3xl:space-y-16 w-full">
            {/* Row 1 - Stats (spanning horizontally under hero) */}
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 2xl:gap-6 3xl:gap-8">
                {[
                  { label: "Books", value: 2, color: "indigo" },
                  { label: "Drafts", value: 7, color: "violet" },
                  { label: "Total words", value: 952, color: "emerald" },
                  { label: "Chapters", value: 1, color: "amber" },
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
                      <ListItem
                        titleDir="auto"
                        title={
                          "\u05D4\u05E1\u05E4\u05E1\u05DC \u05E2\u05DC \u05D4\u05E9\u05D3\u05E8\u05D4"
                        }
                        meta="Modified • 450 words"
                        tag="Story"
                      />
                      <ListItem
                        titleDir="auto"
                        title={"\u05E4\u05E8\u05E7 \u05E9\u05E0\u05D9"}
                        meta="Modified • 225 words"
                        tag="Chapter"
                      />
                      <ListItem
                        titleDir="ltr"
                        title="Academic Outline — Solar Cells"
                        meta="Modified • 820 words"
                        tag="Academic"
                      />
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
                      <div className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-amber-600 mb-2">
                        3
                      </div>
                      <div className="text-sm 2xl:text-base 3xl:text-lg text-amber-700 mb-3">
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
                              <div
                                className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 rounded-full flex items-center justify-center ${
                                  index < 3
                                    ? "bg-amber-500 text-white"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                {index < 3 ? (
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
                          )
                        )}
                      </div>

                      <div className="text-xs sm:text-sm 2xl:text-base 3xl:text-lg text-amber-700/90 mb-4 px-2">
                        Keep it going with a 5‑min sprint
                      </div>
                      <button className="w-full max-w-32 2xl:max-w-40 3xl:max-w-48 mx-auto rounded-xl bg-amber-600 text-white py-2 px-3 2xl:py-3 2xl:px-4 3xl:py-4 3xl:px-6 text-xs sm:text-sm 2xl:text-base 3xl:text-lg hover:opacity-90">
                        Start sprint
                      </button>
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
                    <button
                      key={s}
                      className="rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 sm:px-3 2xl:px-4 3xl:px-6 py-1 sm:py-2 2xl:py-3 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg hover:bg-emerald-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-200 p-3 sm:p-4 2xl:p-6 3xl:p-8 text-base 2xl:text-lg 3xl:text-xl text-slate-700 bg-gradient-to-br from-white to-emerald-50/40">
                  <div className="font-medium mb-2 2xl:mb-3">Preview</div>
                  <p className="mb-3 2xl:mb-4">
                    Try opening with sensory detail: the wood's warmth, city
                    murmurs, a distant bicycle bell…
                  </p>
                  <div className="flex flex-wrap gap-2 2xl:gap-3 3xl:gap-4">
                    <button className="rounded-xl bg-emerald-600 text-white px-3 py-2 2xl:px-4 2xl:py-3 3xl:px-6 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg">
                      Insert
                    </button>
                    <button className="rounded-xl border border-slate-300 px-3 py-2 2xl:px-4 2xl:py-3 3xl:px-6 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg">
                      Undo
                    </button>
                    <button className="rounded-xl border border-slate-300 px-3 py-2 2xl:px-4 2xl:py-3 3xl:px-6 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg">
                      Regenerate
                    </button>
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
                    <button
                      key={t}
                      className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 sm:px-4 2xl:px-5 3xl:px-6 py-2 2xl:py-3 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg hover:bg-indigo-100"
                    >
                      + {t}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 2xl:gap-3 3xl:gap-4">
                  <input
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 2xl:px-6 2xl:py-4 3xl:px-8 3xl:py-6 text-base 2xl:text-lg 3xl:text-xl"
                    placeholder="Quick add (e.g., 'tomorrow 9pm')"
                  />
                  <button className="rounded-xl bg-indigo-600 text-white px-4 py-3 2xl:px-6 2xl:py-4 3xl:px-8 3xl:py-6 text-base 2xl:text-lg 3xl:text-xl sm:whitespace-nowrap">
                    Add
                  </button>
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
                      className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 2xl:p-6 3xl:p-8 hover:ring-1 hover:ring-violet-400 cursor-pointer"
                    >
                      <div
                        className={`h-12 sm:h-16 lg:h-20 2xl:h-24 3xl:h-28 w-full rounded-lg mb-2 sm:mb-3 2xl:mb-4 3xl:mb-6 bg-gradient-to-r ${
                          [
                            "from-indigo-300 to-indigo-500",
                            "from-pink-300 to-rose-500",
                            "from-emerald-300 to-teal-500",
                            "from-violet-300 to-purple-500",
                          ][i]
                        }`}
                      />
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
              confetti toast ��
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

function ListItem({ title, titleDir = "auto", meta, tag }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 2xl:p-6 3xl:p-8 mb-3 2xl:mb-4 3xl:mb-6 flex items-center gap-3 2xl:gap-4 3xl:gap-6 hover:ring-1 hover:ring-[#D6B778] cursor-pointer">
      <div
        className="h-8 w-8 2xl:h-10 2xl:w-10 3xl:h-12 3xl:w-12 rounded-lg bg-slate-100"
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div
          dir={titleDir}
          className="truncate font-medium text-slate-800 text-base lg:text-lg 2xl:text-xl 3xl:text-2xl mb-1 2xl:mb-2"
        >
          {title}
        </div>
        <div className="text-sm 2xl:text-base 3xl:text-lg text-slate-500 flex items-center gap-2 2xl:gap-3">
          <span>{meta}</span>
          {tag && (
            <span className="inline-flex items-center rounded-full px-2 py-1 2xl:px-3 2xl:py-1.5 3xl:px-4 3xl:py-2 text-sm 2xl:text-base 3xl:text-lg font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {tag}
            </span>
          )}
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 2xl:gap-3">
        <button className="rounded-lg border border-slate-300 px-2 py-1 2xl:px-3 2xl:py-2 3xl:px-4 3xl:py-3 text-sm 2xl:text-base 3xl:text-lg">
          Open
        </button>
        <button className="rounded-lg border border-slate-300 px-2 py-1 2xl:px-3 2xl:py-2 3xl:px-4 3xl:py-3 text-sm 2xl:text-base 3xl:text-lg">
          Edit
        </button>
      </div>
    </div>
  );
}
