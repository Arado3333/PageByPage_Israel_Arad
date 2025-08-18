import { Suspense } from "react";
import { getGoals } from "../api/routes";
import GoalsProgress from "./GoalsProgress";
import GoalsSkeletonLoader from "./GoalsSkeletonLoader";

export default function Page() {
    const goalsPromise = getGoals();

    return (
        <>
            <Suspense fallback={<GoalsSkeletonLoader/>}>
                <GoalsProgress goalsPromise={goalsPromise} />
            </Suspense>
        </>
    );
}
