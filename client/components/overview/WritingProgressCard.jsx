

import { BarChart2, ChevronRight } from "lucide-react";
import Link from "next/link";
import WritingProgressStats from "./WritingProgressStats";
import { getProjects } from "../../app/api/routes.js";
// Import progress from Book Manager or shared utility/hook
// import useWritingProgress from "../../app/books/useWritingProgress"

export default function WritingProgressCard() {

    return (
        <div className="dashboard-card progress-card">
            <div className="card-header">
                <h2 className="card-title">
                    <BarChart2 className="card-icon" />
                    Writing Progress
                </h2>
            </div>
            <WritingProgressStats />
            <div className="card-footer">
                <Link href="/analytics" className="card-link">
                    View detailed analytics{" "}
                    <ChevronRight className="link-icon" />
                </Link>
            </div>
        </div>
    );
}
