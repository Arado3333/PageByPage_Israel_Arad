export default function AiSkeleton() {
    return (
        <div className="card-content animate-pulse">
            <ul className="suggestion-list">
                {[...Array(3)].map((_, idx) => (
                    <li
                        key={idx}
                        className="suggestion-item flex items-start gap-4"
                    >
                        <div className="suggestion-icon bg-gray-200 rounded-full w-8 h-8" />
                        <div className="suggestion-details flex-1 min-w-0">
                            <div className="suggestion-title h-4 w-32 bg-gray-200 rounded mb-2" />
                            <div className="suggestion-excerpt h-3 w-48 bg-gray-100 rounded mb-1" />
                            <div className="suggestion-time h-3 w-24 bg-gray-100 rounded" />
                        </div>
                        <div className="suggestion-actions flex gap-2 ml-2">
                            <span className="action-button accept bg-gray-200 rounded-full w-7 h-7" />
                            <span className="action-button reject bg-gray-200 rounded-full w-7 h-7" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
