import Link from "next/link";
import "../style/Dashboard.css";
import WritingProgressCard from "../../components/overview/WritingProgressCard";
import DailyGoalCard from "../../components/overview/DailyGoalCard";
import WritingStreakCard from "../../components/overview/WritingStreakCard";
import UpcomingTasksCard from "../../components/overview/UpcomingTasksCard";
import RecentDraftsCard from "../../components/overview/RecentDraftsCard";
import AISuggestionsCard from "../../components/overview/AISuggestionsCard";
import { getUser } from "../api/routes.js";
import { Suspense, use } from "react";
import PageTransition from "../components/PageTransition";

export default function DashboardPage() {
  const userPromise = getUser();

  return (
    <PageTransition>
      <div className="min-h-screen text-slate-800">
        {/* Decorative blobs */}
        <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-30" />
        </div>

        <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16">
          <Suspense
            fallback={
              <div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
                <div className="h-8 sm:h-10 lg:h-12 xl:h-14 2xl:h-16 3xl:h-18 bg-slate-200 rounded-lg mb-2 animate-pulse" />
                <div className="h-6 sm:h-7 2xl:h-8 3xl:h-9 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
              </div>
            }
          >
            <DashboardHeader userPromise={userPromise} />
          </Suspense>

          <div className="space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-8 2xl:space-y-12 3xl:space-y-16 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
              <WritingProgressCard />
              <DailyGoalCard />
              <WritingStreakCard />
              <UpcomingTasksCard />
              <RecentDraftsCard />
              <AISuggestionsCard />
            </div>

            {/* About Section */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-4 lg:p-5 xl:p-6 2xl:p-8 3xl:p-10">
              <div className="mb-4 2xl:mb-6 3xl:mb-8 flex items-center justify-between">
                <h2 className="font-serif text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-[#0F1A2E]">
                  About Page by Page
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">About</h4>
                  <p className="text-slate-600 text-sm">
                    Page by Page is a smart and intuitive platform for writers
                    to manage books, drafts, and creative work efficiently.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">
                    Useful Links
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <Link
                        href="/contact"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/help"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/privacy"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Connect</h4>
                  <p className="text-slate-600 text-sm">
                    Email: support@pagebypage.ai
                  </p>
                  <p className="text-slate-600 text-sm">© 2025 Page by Page</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function DashboardHeader({ userPromise }) {
  const user = use(userPromise);

  return (
    <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg">
          ✨ Welcome back
        </div>
      </div>
      <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-serif text-[#0F1A2E] mb-2">
        Welcome back, {user.name}
      </h1>
      <p className="text-base sm:text-lg 2xl:text-xl 3xl:text-2xl text-slate-600">
        Here's an overview of your writing journey
      </p>
    </section>
  );
}
