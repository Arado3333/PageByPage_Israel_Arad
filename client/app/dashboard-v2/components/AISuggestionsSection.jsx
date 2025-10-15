"use client";

import { use, useEffect, useState, useTransition } from "react";
import { askAI } from "../../api/routes.js";
import Card from "./shared/Card";

export default function AISuggestionsSection({ aiSuggestionsPromise }) {
  const initialSuggestions = use(aiSuggestionsPromise);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleRegenerate = async () => {
    startTransition(async () => {
      try {
        const newSuggestions = await askAI();
        setAiSuggestions(newSuggestions);
      } catch (error) {
        console.error("Failed to regenerate AI suggestions:", error);
        // Keep current suggestions on error
      }
    });
  };

  useEffect(() => {
    setAiSuggestions(initialSuggestions);
  }, [initialSuggestions]);

  return (
    <div className="w-full">
      <Card title="AI Suggestions" actionLabel="Get more AI help">
        {aiSuggestions && aiSuggestions.length > 0 ? (
          <div className="space-y-4 2xl:space-y-6 3xl:space-y-8">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 2xl:p-6 3xl:p-8 bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-800 dark:to-emerald-900/20"
              >
                {/* Tags above each suggestion */}
                {suggestion.tags && suggestion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 2xl:gap-3 3xl:gap-4 mb-3 2xl:mb-4">
                    {suggestion.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-2 sm:px-3 2xl:px-4 3xl:px-6 py-1 sm:py-2 2xl:py-3 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggestion title */}
                {suggestion.improvementTitle && (
                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2 2xl:mb-3 text-base 2xl:text-lg 3xl:text-xl">
                    {suggestion.improvementTitle}
                  </h4>
                )}

                {/* Suggestion content */}
                <p className="text-slate-700 dark:text-slate-300 text-sm 2xl:text-base 3xl:text-lg leading-relaxed">
                  {suggestion.improveTip}
                </p>
              </div>
            ))}

            {/* Regenerate button */}
            <div className="flex justify-center pt-2 2xl:pt-4">
              <button
                onClick={handleRegenerate}
                disabled={isPending}
                className="rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white border border-slate-300 dark:border-slate-600 px-4 py-2 2xl:px-6 2xl:py-3 3xl:px-8 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {isPending ? "Regenerating..." : "Regenerate Suggestions"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 2xl:py-6 3xl:py-8">
            <div className="text-slate-500 dark:text-slate-400 mb-2 2xl:mb-3">
              🤖 AI suggestions are not available at the moment
            </div>
            <p className="text-sm 2xl:text-base 3xl:text-lg text-slate-400 dark:text-slate-500">
              {aiSuggestions && aiSuggestions.some((s) => s.error)
                ? "There was an issue generating suggestions. Please try again later."
                : "Start writing some content to get personalized AI suggestions!"}
            </p>
            <button
              onClick={handleRegenerate}
              disabled={isPending}
              className="mt-3 2xl:mt-4 3xl:mt-6 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white px-4 py-2 2xl:px-6 2xl:py-3 3xl:px-8 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isPending ? "Loading..." : "Try Again"}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
