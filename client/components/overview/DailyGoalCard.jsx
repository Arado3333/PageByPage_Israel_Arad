import { Target, ChevronRight } from "lucide-react"
import Link from "next/link"
// Import daily goal from Book Manager or shared utility/hook
// import useDailyGoal from "../../app/books/useDailyGoal"

export default function DailyGoalCard() {
  // Replace with shared state/hook if available
  const dummyGoal = {
    current: 450,
    target: 1000,
    percentage: 45,
  }

  return (
    <div className="dashboard-card goal-card">
      <div className="card-header">
        <h2 className="card-title">
          <Target className="card-icon" />
          Daily Writing Goal
        </h2>
      </div>
      <div className="card-content">
        <div className="goal-circle">
          <svg viewBox="0 0 36 36" className="goal-svg">
            <path
              className="goal-circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="goal-circle-fill"
              strokeDasharray={`${dummyGoal.percentage}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="goal-text">
              {dummyGoal.percentage}%
            </text>
          </svg>
        </div>
        <div className="goal-details">
          <div className="goal-numbers">
            <span className="goal-current">{dummyGoal.current}</span>
            <span className="goal-separator">/</span>
            <span className="goal-target">{dummyGoal.target}</span>
            <span className="goal-unit">words</span>
          </div>
          <p className="goal-message">
            {dummyGoal.current < dummyGoal.target
              ? `${dummyGoal.target - dummyGoal.current} more words to reach your daily goal`
              : "You've reached your daily goal!"}
          </p>
        </div>
      </div>
      <div className="card-footer">
        <Link href="/book-editor" className="card-link">
          Continue writing <ChevronRight className="link-icon" />
        </Link>
      </div>
    </div>
  )
}
