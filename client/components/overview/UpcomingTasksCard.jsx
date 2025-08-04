import { Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"
// Import tasks from Task Manager or shared utility/hook
// import useUpcomingTasks from "../../app/task-manager/useUpcomingTasks"

export default function UpcomingTasksCard() {
  // Replace with shared state/hook if available
  const dummyTasks = [
    {
      id: 1,
      title: "Complete Chapter 5 revision",
      dueDate: "Today at 5:00 PM",
      priority: "high",
    },
    {
      id: 2,
      title: "Outline new character arc",
      dueDate: "Tomorrow",
      priority: "medium",
    },
    {
      id: 3,
      title: "Research historical setting",
      dueDate: "In 3 days",
      priority: "low",
    },
  ]

  //const tasks = getUpcomingTasks();

  return (
    <div className="dashboard-card tasks-card">
      <div className="card-header">
        <h2 className="card-title">
          <Calendar className="card-icon" />
          Upcoming Tasks
        </h2>
      </div>
      <div className="card-content">
        <ul className="task-list">
          {dummyTasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-checkbox">
                <input type="checkbox" id={`task-${task.id}`} />
                <label htmlFor={`task-${task.id}`}></label>
              </div>
              <div className="task-details">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-due">{task.dueDate}</p>
              </div>
              <div className={`task-priority ${task.priority}`}>{task.priority}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer">
        <Link href="/task-manager" className="card-link">
          Manage all tasks <ChevronRight className="link-icon" />
        </Link>
      </div>
    </div>
  )
}
