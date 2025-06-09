import { BookOpen, Edit, MessageSquare, Calendar } from "lucide-react"
import Link from "next/link"

export default function QuickActionsCard() {
  return (
    <div className="dashboard-card actions-card">
      <div className="card-header">
        <h2 className="card-title">
          <BookOpen className="card-icon" />
          Quick Actions
        </h2>
      </div>
      <div className="card-content">
        <div className="actions-grid">
          <Link href="/book-editor" className="action-button">
            <Edit className="action-icon" />
            <span className="action-text">New Draft</span>
          </Link>
          <Link href="/books" className="action-button">
            <BookOpen className="action-icon" />
            <span className="action-text">My Books</span>
          </Link>
          <Link href="/ai-consultant" className="action-button">
            <MessageSquare className="action-icon" />
            <span className="action-text">AI Help</span>
          </Link>
          <Link href="/task-manager" className="action-button">
            <Calendar className="action-icon" />
            <span className="action-text">Add Task</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
