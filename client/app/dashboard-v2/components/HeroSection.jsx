"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { getMostRecentDraftInfo } from "../../lib/draftUtils";
import DailyGoalCard from "../DailyGoalCard";

export default function HeroSection({
  userPromise,
  recentDraftsPromise,
  goalsPromise,
}) {
  const user = use(userPromise);
  const recentDrafts = use(recentDraftsPromise);
  const router = useRouter();

  // Get the most recent draft information
  const recentDraftInfo = getMostRecentDraftInfo(recentDrafts);

  const handleResumeWriting = () => {
    if (recentDraftInfo?.draft) {
      // Store the draft context for the editor to load
      sessionStorage.setItem(
        "draftContext",
        JSON.stringify(recentDraftInfo.draft)
      );
      console.log("Resuming draft:", recentDraftInfo.draft);
      router.push("/book-editor-v2");
    } else {
      // If no recent draft, go to new draft creation
      router.push("/book-editor-v2");
    }
  };

  const handleNewDraft = () => {
    router.push("/book-editor-v2");
  };

  const handleOpenLibrary = () => {
    router.push("/books");
  };

  return (
    <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
        <div className="lg:col-span-8 xl:col-span-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg">
            ✨ Welcome back, {user.name}
          </div>
          <h1 className="mt-2 text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-serif text-[#0F1A2E]">
            Pick up where you left off
          </h1>
          <p className="mt-1 text-base sm:text-lg 2xl:text-xl 3xl:text-2xl text-slate-600">
            {recentDraftInfo ? (
              <>
                Resume{" "}
                <span dir="auto" className="font-medium">
                  {recentDraftInfo.draft.title}
                </span>{" "}
                — last edited {recentDraftInfo.displayText}
              </>
            ) : (
              "Start a new writing session"
            )}
          </p>
          <div className="mt-4 sm:mt-5 2xl:mt-8 3xl:mt-10 flex flex-wrap items-center gap-2 sm:gap-3 2xl:gap-4 3xl:gap-6">
            <button
              onClick={handleResumeWriting}
              className="rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-700 text-white px-3 sm:px-4 lg:px-5 2xl:px-6 3xl:px-8 py-2 lg:py-3 2xl:py-4 3xl:py-6 text-sm lg:text-base 2xl:text-lg 3xl:text-xl shadow-sm hover:opacity-90 transition-opacity"
            >
              {recentDraftInfo ? "Resume writing" : "Start writing"}
            </button>
            <button
              onClick={handleNewDraft}
              className="rounded-2xl border border-indigo-200 text-indigo-700 px-3 sm:px-4 lg:px-5 2xl:px-6 3xl:px-8 py-2 lg:py-3 2xl:py-4 3xl:py-6 text-sm lg:text-base 2xl:text-lg 3xl:text-xl hover:bg-indigo-50 transition-colors"
            >
              New draft
            </button>
            <button
              onClick={handleOpenLibrary}
              className="rounded-2xl border border-slate-300 px-3 sm:px-4 lg:px-5 2xl:px-6 3xl:px-8 py-2 lg:py-3 2xl:py-4 3xl:py-6 text-sm lg:text-base 2xl:text-lg 3xl:text-xl hover:bg-white transition-colors"
            >
              Open Library
            </button>
            <button className="rounded-2xl border border-amber-300 text-amber-700 px-3 sm:px-4 lg:px-5 2xl:px-6 3xl:px-8 py-2 lg:py-3 2xl:py-4 3xl:py-6 text-sm lg:text-base 2xl:text-lg 3xl:text-xl hover:bg-amber-50 transition-colors">
              Kids Story Mode
            </button>
          </div>
        </div>
        {/* Daily Goal */}
        <div className="lg:col-span-4 xl:col-span-4">
          <DailyGoalCard goalsPromise={goalsPromise} />
        </div>
      </div>
    </section>
  );
}
