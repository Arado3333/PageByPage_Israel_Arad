"use client";

import { Suspense } from "react";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import RecentDraftsSection from "./components/RecentDraftsSection";
import WritingStreakSection from "./components/WritingStreakSection";
import AISuggestionsSection from "./components/AISuggestionsSection";
import UpcomingTasksSection from "./components/UpcomingTasksSection";
import QuickStartTemplatesSection from "./components/QuickStartTemplatesSection";
import HeroSectionSkeleton from "./components/skeletons/HeroSectionSkeleton";
import StatsSectionSkeleton from "./components/skeletons/StatsSectionSkeleton";
import RecentDraftsSectionSkeleton from "./components/skeletons/RecentDraftsSectionSkeleton";
import WritingStreakSectionSkeleton from "./components/skeletons/WritingStreakSectionSkeleton";
import AISuggestionsSectionSkeleton from "./components/skeletons/AISuggestionsSectionSkeleton";
import UpcomingTasksSectionSkeleton from "./components/skeletons/UpcomingTasksSectionSkeleton";
import QuickStartTemplatesSectionSkeleton from "./components/skeletons/QuickStartTemplatesSectionSkeleton";


export default function Dashboard({
  userPromise,
  goalsPromise,
  statsPromise,
  recentDraftsPromise,
  writingStreakPromise,
  aiSuggestionsPromise,
  upcomingTasksPromise,
  templatesPromise,
}) {
  return (
    <div className="min-h-screen text-slate-800">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
      </div>

      <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16">
        {/* Hero */}
        <Suspense fallback={<HeroSectionSkeleton />}>
          <HeroSection
            userPromise={userPromise}
            recentDraftsPromise={recentDraftsPromise}
            goalsPromise={goalsPromise}
          />
        </Suspense>

        {/* Content */}
        <section className="space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-8 2xl:space-y-12 3xl:space-y-16 w-full">
          {/* Row 1 - Stats (spanning horizontally under hero) */}
          <Suspense fallback={<StatsSectionSkeleton />}>
            <StatsSection statsPromise={statsPromise} />
          </Suspense>

          {/* Row 2 - Recent Drafts and Writing Streak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
            <Suspense fallback={<RecentDraftsSectionSkeleton />}>
              <RecentDraftsSection recentDraftsPromise={recentDraftsPromise} />
            </Suspense>
            <Suspense fallback={<WritingStreakSectionSkeleton />}>
              <WritingStreakSection
                writingStreakPromise={writingStreakPromise}
              />
            </Suspense>
          </div>

          {/* Row 3 - AI Suggestions (spanning horizontally) */}
          <Suspense fallback={<AISuggestionsSectionSkeleton />}>
            <AISuggestionsSection aiSuggestionsPromise={aiSuggestionsPromise} />
          </Suspense>

          {/* Row 4 - Upcoming Tasks */}
          <Suspense fallback={<UpcomingTasksSectionSkeleton />}>
            <UpcomingTasksSection upcomingTasksPromise={upcomingTasksPromise} />
          </Suspense>
        </section>

        <section className="mt-8 2xl:mt-12 3xl:mt-16 text-center text-xs 2xl:text-sm 3xl:text-base text-slate-500 w-full">
          <span>
            PageByPage is a smart and intuitive platform for writers to manage books, drafts, and creative work efficiently. Israel & Arad, 2025
          </span>
        </section>
      </div>
    </div>
  );
}
