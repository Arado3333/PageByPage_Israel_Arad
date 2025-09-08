"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Card from "./shared/Card";
import ListItem from "./shared/ListItem";

export default function RecentDraftsSection({ recentDraftsPromise }) {
  const recentDrafts = use(recentDraftsPromise);
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
    <div className="sm:col-span-2 lg:col-span-8 xl:col-span-8 h-full">
      <Card
        title="Recent Drafts"
        actionLabel="View all drafts"
        className="h-full"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {recentDrafts.map((draft) => (
              <ListItem
                key={draft.id}
                titleDir="auto"
                title={draft.title}
                meta={`${
                  draft.bookName ? draft.bookName + " • " : ""
                }Modified • ${draft.wordCount} words`}
                tag={draft.tag}
                onEdit={(e) => handleEdit(e, draft)}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
