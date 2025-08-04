import { FileText, Edit, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getRecentDrafts } from "../../app/api/routes.js";
import RecentDraftsContent from "./RecentDraftsContent";
import RecentDraftsSkeleton from "./skeletons/RecentDraftsSkeleton";
import { Suspense } from "react";
// Import drafts from Book Manager or shared utility/hook
// import useRecentDrafts from "../../app/books/useRecentDrafts"

export default function RecentDraftsCard() {
    // Replace with shared state/hook if available

    const draftsPromise = getRecentDrafts();

    return (
        <div className="dashboard-card drafts-card">
            <div className="card-header">
                <h2 className="card-title">
                    <FileText className="card-icon" />
                    Recent Drafts
                </h2>
            </div>
            <Suspense fallback={<RecentDraftsSkeleton />}>
                <RecentDraftsContent draftsPromise={draftsPromise} />
            </Suspense>
            <div className="card-footer">
                <Link href="/drafts" className="card-link">
                    View all drafts <ChevronRight className="link-icon" />
                </Link>
            </div>
        </div>
    );
}
