import { FileText, Edit, ChevronRight } from "lucide-react"
import Link from "next/link"
// Import drafts from Book Manager or shared utility/hook
// import useRecentDrafts from "../../app/books/useRecentDrafts"

export default function RecentDraftsCard() {
  // Replace with shared state/hook if available
  const dummyDrafts = [
    {
      id: 1,
      title: "The Silent Echo - Chapter 7",
      lastModified: "2 hours ago",
      wordCount: 2345,
    },
    {
      id: 2,
      title: "Midnight Chronicles - Outline",
      lastModified: "yesterday",
      wordCount: 1120,
    },
    {
      id: 3,
      title: "Character Profile - Eliza",
      lastModified: "3 days ago",
      wordCount: 850,
    },
  ]

  return (
    <div className="dashboard-card drafts-card">
      <div className="card-header">
        <h2 className="card-title">
          <FileText className="card-icon" />
          Recent Drafts
        </h2>
      </div>
      <div className="card-content">
        <ul className="draft-list">
          {dummyDrafts.map((draft) => (
            <li key={draft.id} className="draft-item">
              <div className="draft-icon">
                <Edit />
              </div>
              <div className="draft-details">
                <h3 className="draft-title">{draft.title}</h3>
                <p className="draft-meta">
                  Modified {draft.lastModified} • {draft.wordCount.toLocaleString()} words
                </p>
              </div>
              <Link href="/book-editor" className="draft-action">
                <Edit className="action-icon" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer">
        <Link href="/drafts" className="card-link">
          View all drafts <ChevronRight className="link-icon" />
        </Link>
      </div>
    </div>
  )
}
