import { Target, ChevronRight } from "lucide-react";
import Link from "next/link";
import GoalContent from "./GoalContent";
import GoalSkeleton from "./skeletons/GoalSkeleton";
import { getWritingGoals } from "../../app/api/routes.js";
import { Suspense } from "react";
// Import daily goal from Book Manager or shared utility/hook
// import useDailyGoal from "../../app/books/useDailyGoal"

export default function DailyGoalCard() {
    const goalsPromise = getWritingGoals();

    return (
        <div className="dashboard-card goal-card">
            <div className="card-header">
                <h2 className="card-title">
                    <Target className="card-icon" />
                    Daily Writing Goal
                </h2>
            </div>
            <Suspense fallback={<GoalSkeleton />}>
                <GoalContent goalsPromise={goalsPromise} />
            </Suspense>
            <div className="card-footer">
                <Link href="/book-editor" className="card-link">
                    Continue writing <ChevronRight className="link-icon" />
                </Link>
            </div>
        </div>
    );
}
