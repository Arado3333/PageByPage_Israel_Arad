"use client";

import { use } from "react";
import Card from "./shared/Card";

export default function AISuggestionsSection({ aiSuggestionsPromise }) {
  const aiSuggestions = use(aiSuggestionsPromise);

  return (
    <div className="w-full">
      <Card title="AI Suggestions" actionLabel="Get more AI help">
        <div className="flex flex-wrap gap-2 2xl:gap-3 3xl:gap-4 mb-4">
          {aiSuggestions &&
          aiSuggestions.length > 0 &&
          !aiSuggestions.some((s) => s.error) ? (
            aiSuggestions.map((s, index) =>
              s.tags?.map((t, index2) => (
                <button
                  key={`${index}-${index2}`}
                  className="rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 sm:px-3 2xl:px-4 3xl:px-6 py-1 sm:py-2 2xl:py-3 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg hover:bg-emerald-100"
                >
                  {t}
                </button>
              ))
            )
          ) : (
            <div className="text-sm 2xl:text-base 3xl:text-lg text-slate-500 italic">
              No suggestions available
            </div>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 p-3 sm:p-4 2xl:p-6 3xl:p-8 text-base 2xl:text-lg 3xl:text-xl text-slate-700 bg-gradient-to-br from-white to-emerald-50/40">
          <div className="font-medium mb-2 2xl:mb-3">Preview</div>
          {aiSuggestions &&
          aiSuggestions.length > 0 &&
          !aiSuggestions.some((s) => s.error) ? (
            <>
              <p className="mb-3 2xl:mb-4">
                {aiSuggestions.map((s) => s.improveTip).join("\n")}
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
            </>
          ) : (
            <div className="text-center py-4 2xl:py-6 3xl:py-8">
              <div className="text-slate-500 mb-2 2xl:mb-3">
                🤖 AI suggestions are not available at the moment
              </div>
              <p className="text-sm 2xl:text-base 3xl:text-lg text-slate-400">
                {aiSuggestions && aiSuggestions.some((s) => s.error)
                  ? "There was an issue generating suggestions. Please try again later."
                  : "Start writing some content to get personalized AI suggestions!"}
              </p>
              <button className="mt-3 2xl:mt-4 3xl:mt-6 rounded-xl bg-emerald-600 text-white px-4 py-2 2xl:px-6 2xl:py-3 3xl:px-8 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg hover:opacity-90">
                Try Again
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
