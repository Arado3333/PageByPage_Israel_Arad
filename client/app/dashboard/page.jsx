"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  Edit,
  FileText,
  Calendar,
  MessageSquare,
  CheckCircle2,
  BarChart2,
  Target,
  ChevronRight,
  Sparkles,
  PenTool,
  AlertCircle,
} from "lucide-react"
import "../style/Dashboard.css"

// Dummy data - can be replaced with API calls later
const dummyData = {
  writingProgress: {
    totalBooks: 3,
    totalDrafts: 8,
    totalWords: 124580,
    chaptersCompleted: 24,
  },
  dailyGoal: {
    current: 450,
    target: 1000,
    percentage: 45,
  },
  upcomingTasks: [
    {
      id: 1,
      title: "Complete Chapter 5 revision",
      dueDate: "Today at 5:00 PM",
      priority: "high",
    },
    {
      id: 2,
      title: "Outline new character arc",
      dueDate: "Tomorrow",
      priority: "medium",
    },
    {
      id: 3,
      title: "Research historical setting",
      dueDate: "In 3 days",
      priority: "low",
    },
  ],
  recentDrafts: [
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
  ],
  aiSuggestions: [
    {
      id: 1,
      title: "Style improvement for Chapter 3",
      excerpt: "Consider varying sentence structure to improve flow...",
      timestamp: "1 day ago",
    },
    {
      id: 2,
      title: "Plot hole detected in Chapter 5",
      excerpt: "The character's motivation seems inconsistent with...",
      timestamp: "2 days ago",
    },
  ],
  writingStreak: {
    currentStreak: 12,
    lastWeek: [true, true, true, true, true, false, true], // last 7 days, starting from 6 days ago to today
  },
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome back, Writer</h1>
      <p className="dashboard-subtitle">Here's an overview of your writing journey</p>

      {isLoading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your writing data...</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* Writing Progress Tracker */}
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
                  <div className="stat-value">{dummyData.writingProgress.totalBooks}</div>
                  <div className="stat-label">Books</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{dummyData.writingProgress.totalDrafts}</div>
                  <div className="stat-label">Drafts</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{dummyData.writingProgress.totalWords.toLocaleString()}</div>
                  <div className="stat-label">Total Words</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{dummyData.writingProgress.chaptersCompleted}</div>
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

          {/* Daily Writing Goal */}
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
                    strokeDasharray={`${dummyData.dailyGoal.percentage}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="goal-text">
                    {dummyData.dailyGoal.percentage}%
                  </text>
                </svg>
              </div>
              <div className="goal-details">
                <div className="goal-numbers">
                  <span className="goal-current">{dummyData.dailyGoal.current}</span>
                  <span className="goal-separator">/</span>
                  <span className="goal-target">{dummyData.dailyGoal.target}</span>
                  <span className="goal-unit">words</span>
                </div>
                <p className="goal-message">
                  {dummyData.dailyGoal.current < dummyData.dailyGoal.target
                    ? `${dummyData.dailyGoal.target - dummyData.dailyGoal.current} more words to reach your daily goal`
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

          {/* Writing Streak */}
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
                  <span className="streak-number">{dummyData.writingStreak.currentStreak}</span>
                  <span className="streak-label">days</span>
                </div>
                <div className="streak-badge">Current Streak</div>
              </div>
              <div className="streak-calendar">
                {dummyData.writingStreak.lastWeek.map((active, index) => (
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

          {/* Upcoming Tasks */}
          <div className="dashboard-card tasks-card">
            <div className="card-header">
              <h2 className="card-title">
                <Calendar className="card-icon" />
                Upcoming Tasks
              </h2>
            </div>
            <div className="card-content">
              <ul className="task-list">
                {dummyData.upcomingTasks.map((task) => (
                  <li key={task.id} className="task-item">
                    <div className="task-checkbox">
                      <input type="checkbox" id={`task-${task.id}`} />
                      <label htmlFor={`task-${task.id}`}></label>
                    </div>
                    <div className="task-details">
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-due">{task.dueDate}</p>
                    </div>
                    <div className={`task-priority ${task.priority}`}>{task.priority}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <Link href="/task-manager" className="card-link">
                Manage all tasks <ChevronRight className="link-icon" />
              </Link>
            </div>
          </div>

          {/* Recent Drafts */}
          <div className="dashboard-card drafts-card">
            <div className="card-header">
              <h2 className="card-title">
                <FileText className="card-icon" />
                Recent Drafts
              </h2>
            </div>
            <div className="card-content">
              <ul className="draft-list">
                {dummyData.recentDrafts.map((draft) => (
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

          {/* AI Suggestions */}
          <div className="dashboard-card ai-card">
            <div className="card-header">
              <h2 className="card-title">
                <Sparkles className="card-icon" />
                AI Suggestions
              </h2>
            </div>
            <div className="card-content">
              <ul className="suggestion-list">
                {dummyData.aiSuggestions.map((suggestion) => (
                  <li key={suggestion.id} className="suggestion-item">
                    <div className="suggestion-icon">
                      <PenTool />
                    </div>
                    <div className="suggestion-details">
                      <h3 className="suggestion-title">{suggestion.title}</h3>
                      <p className="suggestion-excerpt">{suggestion.excerpt}</p>
                      <p className="suggestion-time">{suggestion.timestamp}</p>
                    </div>
                    <div className="suggestion-actions">
                      <button className="action-button accept" aria-label="Accept suggestion">
                        <CheckCircle2 className="action-icon" />
                      </button>
                      <button className="action-button reject" aria-label="Reject suggestion">
                        <AlertCircle className="action-icon" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <Link href="/ai-consultant" className="card-link">
                Get more AI help <ChevronRight className="link-icon" />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
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
          <div className="dashboard-card footer-card">
  <div className="card-header">
    <h2 className="card-title">About Page by Page</h2>
  </div>
  <div className="card-content">
    <div className="footer-columns">
      <div className="footer-column">
        <h4>About</h4>
        <p>
          Page by Page is a smart and intuitive platform for writers to manage books,
          drafts, and creative work efficiently.
        </p>
      </div>
      <div className="footer-column">
        <h4>Useful Links</h4>
        <ul>
          <li><Link href="/contact">Contact Us</Link></li>
          <li><Link href="/help">Help Center</Link></li>
          <li><Link href="/privacy">Privacy Policy</Link></li>
        </ul>
      </div>
      <div className="footer-column">
        <h4>Connect</h4>
        <p>Email: support@pagebypage.ai</p>
        <p>© 2025 Page by Page</p>
      </div>
    </div>
  </div>
</div>

        </div>
      )}
    </div>
  )
}
