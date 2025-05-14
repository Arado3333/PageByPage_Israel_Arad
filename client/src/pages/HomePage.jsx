import { BookOpen, Edit, FileText, Zap, Plus, Clock, Calendar, Target } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card"
import PageHeader from "../components/PageHeader"
import "../style/HomePage.css"

function HomePage() {
  const books = [
    {
      id: 1,
      title: "The Dark Wanderer",
      coverColor: "#2a4365",
      coverText: "TDW",
      chapters: 12,
      wordCount: 45230,
      progress: 65,
      lastEdited: "2 hours ago",
    },
    {
      id: 2,
      title: "Chronicles of Light",
      coverColor: "#3c366b",
      coverText: "COL",
      chapters: 8,
      wordCount: 32450,
      progress: 40,
      lastEdited: "Yesterday",
    },
    {
      id: 3,
      title: "Echoes of Tomorrow",
      coverColor: "#234e52",
      coverText: "EOT",
      chapters: 5,
      wordCount: 18720,
      progress: 25,
      lastEdited: "3 days ago",
    },
    {
      id: 4,
      title: "Whispers in the Void",
      coverColor: "#44337a",
      coverText: "WIV",
      chapters: 3,
      wordCount: 9850,
      progress: 15,
      lastEdited: "1 week ago",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      book: "The Dark Wanderer",
      action: "Edited Chapter 12",
      time: "2 hours ago",
    },
    {
      id: 2,
      book: "The Dark Wanderer",
      action: "Added new character: Elara Dawnlight",
      time: "Yesterday",
    },
    {
      id: 3,
      book: "Chronicles of Light",
      action: "Updated plot outline",
      time: "2 days ago",
    },
    {
      id: 4,
      book: "Echoes of Tomorrow",
      action: "Completed Chapter 5",
      time: "3 days ago",
    },
  ]

  const writingGoals = [
    {
      id: 1,
      goal: "Daily Word Count",
      target: "1,000 words",
      progress: 75,
      book: "All Books",
    },
    {
      id: 2,
      goal: "Complete Chapter 13",
      target: "By April 15",
      progress: 40,
      book: "The Dark Wanderer",
    },
    {
      id: 3,
      goal: "Weekly Writing Time",
      target: "10 hours",
      progress: 60,
      book: "All Books",
    },
  ]

  return (
    <div className="home-page">
      <PageHeader
        title="Writer's Dashboard"
        description="Manage your books, track progress, and set writing goals"
        icon={BookOpen}
      />

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon-container">
            <Edit className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value">5,302</div>
            <div className="stat-label">Words this week</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-container">
            <FileText className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value">4</div>
            <div className="stat-label">Active projects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-container">
            <Clock className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value">14.5</div>
            <div className="stat-label">Hours writing</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-container">
            <Zap className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value">85%</div>
            <div className="stat-label">Writing goal progress</div>
          </div>
        </div>
      </div>

      <div className="home-content">
        <div className="books-section">
          <div className="section-header">
            <h2 className="section-title">Your Books</h2>
            <button className="new-book-button">
              <Plus className="button-icon" />
              <span>New Book</span>
            </button>
          </div>

          <div className="books-grid">
            {books.map((book) => (
              <div className="book-card" key={book.id}>
                <div className="book-cover" style={{ backgroundColor: book.coverColor }}>
                  <span className="book-cover-text">{book.coverText}</span>
                </div>
                <div className="book-details">
                  <h3 className="book-title">{book.title}</h3>
                  <div className="book-meta">
                    <span className="book-chapters">{book.chapters} Chapters</span>
                    <span className="book-words">{book.wordCount.toLocaleString()} words</span>
                  </div>
                  <div className="book-progress-container">
                    <div className="book-progress-bar">
                      <div className="book-progress-fill" style={{ width: `${book.progress}%` }}></div>
                    </div>
                    <span className="book-progress-text">{book.progress}%</span>
                  </div>
                  <div className="book-last-edited">
                    <Clock className="last-edited-icon" />
                    <span>Edited {book.lastEdited}</span>
                  </div>
                  <div className="book-actions">
                    <button className="book-action-button primary">Continue Writing</button>
                    <button className="book-action-button">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-sidebar">
          <Card className="recent-activity">
            <CardHeader>
              <CardTitle icon={Clock}>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div className="activity-item" key={activity.id}>
                    <div className="activity-time">{activity.time}</div>
                    <div className="activity-content">
                      <div className="activity-book">{activity.book}</div>
                      <div className="activity-action">{activity.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="writing-goals">
            <CardHeader>
              <CardTitle icon={Target}>Writing Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="goals-list">
                {writingGoals.map((goal) => (
                  <div className="goal-item" key={goal.id}>
                    <div className="goal-info">
                      <div className="goal-name">{goal.goal}</div>
                      <div className="goal-target">{goal.target}</div>
                      <div className="goal-book">{goal.book}</div>
                    </div>
                    <div className="goal-progress-container">
                      <div className="goal-progress-bar">
                        <div className="goal-progress-fill" style={{ width: `${goal.progress}%` }}></div>
                      </div>
                      <span className="goal-progress-text">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
                <button className="view-all-goals">View All Goals</button>
              </div>
            </CardContent>
          </Card>

          <Card className="upcoming-deadlines">
            <CardHeader>
              <CardTitle icon={Calendar}>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="deadlines-list">
                <div className="deadline-item">
                  <div className="deadline-date">Apr 15</div>
                  <div className="deadline-content">
                    <div className="deadline-title">Complete Chapter 13</div>
                    <div className="deadline-book">The Dark Wanderer</div>
                  </div>
                </div>
                <div className="deadline-item">
                  <div className="deadline-date">Apr 20</div>
                  <div className="deadline-content">
                    <div className="deadline-title">Character Development</div>
                    <div className="deadline-book">Chronicles of Light</div>
                  </div>
                </div>
                <div className="deadline-item">
                  <div className="deadline-date">May 1</div>
                  <div className="deadline-content">
                    <div className="deadline-title">First Draft Completion</div>
                    <div className="deadline-book">The Dark Wanderer</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomePage
