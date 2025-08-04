import { BarChart2, ChevronRight } from "lucide-react";
import Link from "next/link";
import WritingProgressStats from "./WritingProgressStats";
import LoadingGrid from "./skeletons/LoadingGrid";
import { Suspense } from "react";
import { getUserStats } from "../../app/api/routes";
// Import progress from Book Manager or shared utility/hook
// import useWritingProgress from "../../app/books/useWritingProgress"

export default function WritingProgressCard() {
    const statsPromise = getUserStats();

    return (
        <div className="dashboard-card progress-card">
            <div className="card-header">
                <h2 className="card-title">
                    <BarChart2 className="card-icon" />
                    Writing Progress
                </h2>
            </div>
            <Suspense fallback={<LoadingGrid />}>
                <WritingProgressStats statsPromise={statsPromise} />
            </Suspense>
        </div>
    );
}
