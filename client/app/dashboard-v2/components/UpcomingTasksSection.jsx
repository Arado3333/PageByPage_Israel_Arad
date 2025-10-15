"use client";

import { use } from "react";
import Card from "./shared/Card";

export default function UpcomingTasksSection({ upcomingTasksPromise }) {
  // Use the promise directly - errors will be handled by Suspense/Error Boundary
  const tasks = use(upcomingTasksPromise);

  return (
    <div className="w-full">
      <Card title="Upcoming Tasks" actionLabel="Manage all tasks">
        <div className="flex flex-wrap gap-2 2xl:gap-3 3xl:gap-4 mb-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <button
                key={typeof task === "string" ? task : task.id || index}
                className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 px-3 sm:px-4 2xl:px-5 3xl:px-6 py-2 2xl:py-3 3xl:py-4 text-sm 2xl:text-base 3xl:text-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
              >
                +{" "}
                {typeof task === "string" ? task : task.title || task.fullTitle}
              </button>
            ))
          ) : (
            <div className="text-sm 2xl:text-base 3xl:text-lg text-slate-500 dark:text-slate-400 italic">
              No upcoming tasks
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
