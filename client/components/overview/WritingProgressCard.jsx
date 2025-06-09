import { BarChart2, ChevronRight } from "lucide-react"
import Link from "next/link"
// Import progress from Book Manager or shared utility/hook
// import useWritingProgress from "../../app/books/useWritingProgress"

export default function WritingProgressCard() {
  // Replace with shared state/hook if available
  const dummyProgress = {
    totalBooks: 3,
    totalDrafts: 8,
    totalWords: 124580,
    chaptersCompleted: 24,
  }

  return (
    <div className="dashboard-card progress-card">
      <div className="card-header">
        <h2 className="card-title">
          <BarChart2 className="card-icon" />
          Writing Progress
        </h2>
      </div>
      <div className="card-content">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{dummyProgress.totalBooks}</div>
            <div className="stat-label">Books</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{dummyProgress.totalDrafts}</div>
            <div className="stat-label">Drafts</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{dummyProgress.totalWords.toLocaleString()}</div>
            <div className="stat-label">Total Words</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{dummyProgress.chaptersCompleted}</div>
            <div className="stat-label">Chapters</div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <Link href="/analytics" className="card-link">
          View detailed analytics <ChevronRight className="link-icon" />
        </Link>
      </div>
    </div>
  )
}
