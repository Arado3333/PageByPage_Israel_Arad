


import { getProjectsWithCookies, getRecentDrafts_noSlice } from "../api/routes";
import DraftsContent from "./DraftsContent";

export default async function DraftsDataProvider() {
    // Get the promise for drafts data
    const draftsPromise = getRecentDrafts_noSlice();
    const booksPromise = getProjectsWithCookies();
    // Pass the promise to the client component
    return <DraftsContent draftsPromise={draftsPromise} booksPromise={booksPromise}/>;
}