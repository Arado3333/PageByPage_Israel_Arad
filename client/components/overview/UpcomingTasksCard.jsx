import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getUpcomingTasks } from "../../app/api/routes.js";
import TasksContent from "./TasksContent";
import TasksSkeleton from "./skeletons/TasksSkeleton";
import { Suspense } from "react";
// Import tasks from Task Manager or shared utility/hook
// import useUpcomingTasks from "../../app/task-manager/useUpcomingTasks"

export default function UpcomingTasksCard() {
    // Replace with shared state/hook if available

    const tasksPromise = getUpcomingTasks();

    return (
        <div className="dashboard-card tasks-card">
            <div className="card-header">
                <h2 className="card-title">
                    <Calendar className="card-icon" />
                    Upcoming Tasks
                </h2>
            </div>
            <Suspense fallback={<TasksSkeleton />}>
                <TasksContent tasksPromise={tasksPromise} />
            </Suspense>
            <div className="card-footer">
                <Link href="/task-manager" className="card-link">
                    Manage all tasks <ChevronRight className="link-icon" />
                </Link>
            </div>
        </div>
    );
}
