import { CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"
// Import streak logic from Task Manager or a shared utility/hook
// import useWritingStreak from "../../app/task-manager/useWritingStreak"

export default function WritingStreakCard() {
  // Replace with shared state/hook if available
  const dummyStreak = {
    currentStreak: 12,
    lastWeek: [true, true, true, true, true, false, true],
  }

  return (
    <div className="dashboard-card streak-card">
      <div className="card-header">
        <h2 className="card-title">
          <CheckCircle2 className="card-icon" />
          Writing Streak
        </h2>
      </div>
      <div className="card-content">
        <div className="streak-header">
          <div className="streak-count">
            <span className="streak-number">{dummyStreak.currentStreak}</span>
            <span className="streak-label">days</span>
          </div>
          <div className="streak-badge">Current Streak</div>
        </div>
        <div className="streak-calendar">
          {dummyStreak.lastWeek.map((active, index) => (
            <div key={index} className={`streak-day ${active ? "active" : ""}`}>
              <div className="streak-dot"></div>
              <div className="streak-day-label">
                {new Date(Date.now() - (6 - index) * 86400000).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="streak-message">Write today to maintain your streak!</p>
      </div>
      <div className="card-footer">
        <Link href="/book-editor" className="card-link">
          Start writing <ChevronRight className="link-icon" />
        </Link>
      </div>
    </div>
  )
}
