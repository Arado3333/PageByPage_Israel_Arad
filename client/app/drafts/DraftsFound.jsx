"use client";
import { use, useMemo } from "react";

export default function DraftsFound({ booksPromise }) {
    const books = use(booksPromise);

    const draftsFound = useMemo(() => {
        return books.flatMap((book) => book.drafts || []);
    }, [books]);

    return (
        <div className="dm-results-info">
            {draftsFound.length} {draftsFound.length === 1 ? "draft" : "drafts"}{" "}
            found
        </div>
    );
}
