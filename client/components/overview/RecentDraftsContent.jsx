"use client";

import { use } from "react";
import { Edit, FileText } from "lucide-react";

export default function RecentDraftsContent({ draftsPromise }) {
    const recentDrafts = use(draftsPromise);

    return (
        <div className="card-content">
            <ul className="draft-list">
                {recentDrafts.map((draft, index) => (
                    <li key={index} className="draft-item flex items-center justify-between gap-4 p-2 border-b last:border-b-0">
                        <div className="draft-icon flex-shrink-0 text-gray-300 mr-2">
                            <FileText />
                        </div>
                        <div className="draft-details">
                            <h3 className="draft-title">{draft.title}</h3>
                            <p className="draft-meta">
                                Modified {draft.lastModified} •{" "}
                                {draft?.wordCount?.toLocaleString("en-US")} words
                            </p>
                        </div>
                        <a href="/book-editor" className="draft-action flex-shrink-0 ml-2 p-1 rounded">
                            <Edit className="action-icon" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
