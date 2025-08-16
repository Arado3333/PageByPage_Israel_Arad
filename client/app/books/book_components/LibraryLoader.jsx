export default function LibraryLoader() {
    // Pure skeleton loader for library grid
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, idx) => (
                <div
                    key={idx}
                    className="card animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-4 h-48 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-center mb-2">
                        <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-600 rounded" />
                        <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
                    </div>
                    <div className="flex gap-2 mt-2">
                        {[...Array(3)].map((_, tagIdx) => (
                            <div
                                key={tagIdx}
                                className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded"
                            />
                        ))}
                    </div>
                    <div className="mt-4 h-4 w-full bg-gray-300 dark:bg-gray-600 rounded" />
                    <div className="mt-2 h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
                </div>
            ))}
        </div>
    );
}
