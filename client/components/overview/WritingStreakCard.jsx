import { CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { calcWritingStreak } from "../../app/api/routes.js";
import WritingStreakStats from "./WritingStreakStats";
import StreakSkeleton from "./skeletons/StreakSkeleton";
import { Suspense } from "react";
// Import streak logic from Task Manager or a shared utility/hook
// import useWritingStreak from "../../app/task-manager/useWritingStreak"

export default function WritingStreakCard() {
    // Replace with shared state/hook if available

    const streakPromise = calcWritingStreak();

    return (
        <div className="dashboard-card streak-card">
            <div className="card-header">
                <h2 className="card-title">
                    <CheckCircle2 className="card-icon" />
                    Writing Streak
                </h2>
            </div>
            <Suspense fallback={<StreakSkeleton/>}>
                <WritingStreakStats streakPromise={streakPromise} />
            </Suspense>
            <div className="card-footer">
                <Link href="/book-editor" className="card-link">
                    Start writing <ChevronRight className="link-icon" />
                </Link>
            </div>
        </div>
    );
}
