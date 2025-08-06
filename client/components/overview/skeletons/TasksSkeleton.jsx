export default function TasksSkeleton() {
    // Render 3 skeleton items as placeholders
    return (
        <div className="card-content">
            <ul className="task-list">
                {[...Array(3)].map((_, idx) => (
                    <li
                        key={idx}
                        className="task-item flex items-center gap-4 animate-pulse"
                    >
                        <div className="task-checkbox">
                            <span className="inline-block w-5 h-5 bg-gray-200 rounded" />
                        </div>
                        <div className="task-details flex-1 min-w-0">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-20 bg-gray-100 rounded" />
                        </div>
                        <div className="task-priority bg-gray-200 rounded px-3 py-1 w-16 h-6" />
                    </li>
                ))}
            </ul>
        </div>
    );
}
