"use client";
import { Plus } from "lucide-react";

export default function GoalHeader({ onNewTask }) {
    return (
        <header className="page-header">
            <h1>Goals & Progress</h1>
            <button
                className="new-task-button desktop-only"
                onClick={onNewTask}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onNewTask();
                    }
                }}
            >
                <Plus size={16} />
                New Task
            </button>
        </header>
    );
}
