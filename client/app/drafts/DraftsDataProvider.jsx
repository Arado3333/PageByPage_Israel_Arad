import { Suspense } from "react";
import { getProjectsWithCookies, getRecentDrafts_noSlice } from "../api/routes";
import DraftsContent from "./DraftsContent";
import DraftsLoader from "./DraftsLoader";

export default function DraftsDataProvider() {
    // Get the promise for drafts data
    const draftsPromise = getRecentDrafts_noSlice();
    const booksPromise = getProjectsWithCookies();
    // Pass the promise to the client component
    return (
        <Suspense fallback={<DraftsLoader/>}>
            <DraftsContent
                draftsPromise={draftsPromise}
                booksPromise={booksPromise}
            />
        </Suspense>
    );
}
