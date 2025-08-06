"use client"; 
import { use } from "react"; 

export default function TasksContent({tasksPromise}) {

    const tasks = use(tasksPromise);

    return (
        <div className="card-content">
            <ul className="task-list">
                {tasks.map((task, idx) => (
                    <li key={idx} className="task-item">
                        <div className="task-checkbox">
                            <input type="checkbox" id={`task-${task.id}`} />
                            <label htmlFor={`task-${task.id}`}></label>
                        </div>
                        <div className="task-details">
                            <h3 className="task-title">{task.title}</h3>
                            <p className="task-due">{task.wordDate}, {task.dueDate}</p>
                        </div>
                        <div className={`task-priority ${task.priority}`}>
                            {task.priority}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
