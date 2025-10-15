import { Suspense } from "react";
import { getGoals } from "../api/routes.js";
import GoalsProgress from "./GoalsProgress";
import GoalsSkeletonLoader from "./GoalsSkeletonLoader";

export default function Page() {
  const goalsPromise = getGoals();

  return (
    <>
      {/* Decorative background blobs for vibrant styling */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 dark:from-indigo-600/20 dark:to-purple-600/20 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 dark:from-emerald-600/20 dark:to-cyan-600/20 blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-600/20 dark:to-orange-600/20 blur-3xl opacity-30" />
      </div>
      <Suspense fallback={<GoalsSkeletonLoader />}>
        <GoalsProgress goalsPromise={goalsPromise} />
      </Suspense>
    </>
  );
}
