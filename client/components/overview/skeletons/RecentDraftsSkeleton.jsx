import { FileText, Edit } from "lucide-react";

export default function RecentDraftsSkeleton() {
    // Render 3 skeleton items as placeholders
    return (
        <div className="card-content">
            <ul className="draft-list">
                {[...Array(3)].map((_, index) => (
                    <li
                        key={index}
                        className="draft-item flex items-center justify-between gap-4 p-2 border-b last:border-b-0 animate-pulse"
                    >
                        <div className="draft-icon flex-shrink-0 text-gray-300 mr-2">
                            <FileText />
                        </div>
                        <div className="draft-details flex-1 min-w-0">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-24 bg-gray-100 rounded" />
                        </div>
                        <div className="draft-action flex-shrink-0 ml-2 p-1 rounded">
                            <Edit className="action-icon text-gray-200" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
