"use client";
import { use, useMemo } from "react";
import PageTransition from "../components/PageTransition";

export default function DraftsFound({ booksPromise }) {
  const books = use(booksPromise);

  const draftsFound = useMemo(() => {
    return books.flatMap((book) => book.drafts || []);
  }, [books]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16 w-full">
        <div className="dm-results-info text-sm 2xl:text-base 3xl:text-lg text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 inline-block">
          {draftsFound.length} {draftsFound.length === 1 ? "draft" : "drafts"}{" "}
          found
        </div>
      </div>
    </PageTransition>
  );
}
