"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Edit, FileText } from "lucide-react";

export default function RecentDraftsContent({ draftsPromise }) {
  const recentDrafts = use(draftsPromise);
  const router = useRouter();

  const handleEdit = (e, draft) => {
    e.preventDefault();
    e.stopPropagation();
    // Store the draft context for the editor to load
    sessionStorage.setItem("draftContext", JSON.stringify(draft));
    console.log("Editing draft:", draft);
    router.push("/book-editor-v2");
  };

  return (
    <div className="card-content">
      <ul className="draft-list">
        {recentDrafts.map((draft, index) => (
          <li
            key={index}
            className="draft-item flex items-center justify-between gap-4 p-2 border-b last:border-b-0"
          >
            <div className="draft-icon flex-shrink-0 text-gray-300 mr-2">
              <FileText />
            </div>
            <div className="draft-details">
              <h3 className="draft-title">{draft.title}</h3>
              <p className="draft-meta">
                {draft.bookName ? `${draft.bookName} • ` : ""}Modified{" "}
                {draft.lastModified} •{" "}
                {draft?.wordCount?.toLocaleString("en-US")} words
              </p>
            </div>
            <button
              onClick={(e) => handleEdit(e, draft)}
              className="draft-action flex-shrink-0 ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <Edit className="action-icon" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
