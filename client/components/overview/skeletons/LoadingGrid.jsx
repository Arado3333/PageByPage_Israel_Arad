export default function LoadingGrid() {
    return (
        <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center bg-[#f3f1eb] rounded-md p-7 shadow animate-pulse">
                    <div className="h-6 w-12 bg-blue-200 rounded mb-2" />
                    <div className="text-sm text-gray-400">Books</div>
                </div>
                <div className="flex flex-col items-center bg-[#f3f1eb] rounded-md p-7 shadow animate-pulse">
                    <div className="h-6 w-12 bg-blue-200 rounded mb-2" />
                    <div className="text-sm text-gray-400">Drafts</div>
                </div>
                <div className="flex flex-col items-center bg-[#f3f1eb] rounded-md p-7 shadow animate-pulse">
                    <div className="h-6 w-16 bg-blue-200 rounded mb-2" />
                    <div className="text-sm text-gray-400">Total Words</div>
                </div>
                <div className="flex flex-col items-center bg-[#f3f1eb] rounded-md p-7 shadow animate-pulse">
                    <div className="h-6 w-10 bg-blue-200 rounded mb-2" />
                    <div className="text-sm text-gray-400">Chapters</div>
                </div>
            </div>
        </div>
    );
}
