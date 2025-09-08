import { Suspense } from "react";
import {
  getWritingGoals,
  getUser,
  getUserStats,
  getRecentDrafts,
  calcWritingStreak,
  askAI,
  getUpcomingTasks,
  getTemplates,
} from "../api/routes.js";
import Dashboard from "./Dashboard";
import DashboardSkeleton from "./DashboardSkeleton";

export default function Page() {
  // Fetch all data in parallel for optimal performance
  const userPromise = getUser();
  const goalsPromise = getWritingGoals();
  const statsPromise = getUserStats();
  const recentDraftsPromise = getRecentDrafts();
  const writingStreakPromise = calcWritingStreak();
  const aiSuggestionsPromise = askAI();
  const upcomingTasksPromise = getUpcomingTasks();
  const templatesPromise = getTemplates();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard
        userPromise={userPromise}
        goalsPromise={goalsPromise}
        statsPromise={statsPromise}
        recentDraftsPromise={recentDraftsPromise}
        writingStreakPromise={writingStreakPromise}
        aiSuggestionsPromise={aiSuggestionsPromise}
        upcomingTasksPromise={upcomingTasksPromise}
        templatesPromise={templatesPromise}
      />
    </Suspense>
  );
}
