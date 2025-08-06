export default function StreakSkeleton() {
    return (
        <div className="card-content animate-pulse">
            <div className="streak-header">
                <div className="streak-count">
                    <span className="streak-number bg-gray-200 rounded w-16 h-8 inline-block mb-2" />
                    <span className="streak-label bg-gray-100 rounded w-10 h-4 inline-block" />
                </div>
                <div className="streak-badge bg-gray-200 rounded w-24 h-6 inline-block" />
            </div>
            <div className="streak-calendar flex gap-2 mt-4">
                {[...Array(7)].map((_, index) => (
                    <div
                        key={index}
                        className="streak-day flex flex-col items-center"
                    >
                        <div className="streak-dot w-6 h-6 bg-gray-200 rounded-full mb-1" />
                        <div className="streak-day-label bg-gray-100 rounded w-8 h-3" />
                    </div>
                ))}
            </div>
            <div className="streak-message bg-gray-100 rounded w-40 h-4 mt-6"/>
            <p className="text-center text-sm mt-2">Streak pending...</p>
        </div>
    );
}
