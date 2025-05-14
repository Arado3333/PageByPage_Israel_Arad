"use client"

import { useState } from "react"
import { Target, Calendar, Check, Edit, Plus, Clock, BarChart2, Trophy } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/Card"
import PageHeader from "../components/PageHeader"
import "../style/WritingGoals.css"

function WritingGoals() {
  const [activeTab, setActiveTab] = useState("current")
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [newGoalType, setNewGoalType] = useState("daily")

  return (
    <div className="writing-goals-page">
      <PageHeader
        title="Writing Goals"
        description="Set and track your writing targets to stay motivated and productive"
        icon={Target}
      />

      <div className="goals-actions">
        <div className="goals-tabs">
          <button
            className={`goals-tab ${activeTab === "current" ? "active" : ""}`}
            onClick={() => setActiveTab("current")}
          >
            Current Goals
          </button>
          <button
            className={`goals-tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={`goals-tab ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        <button className="add-goal-button" onClick={() => setShowNewGoalForm(true)}>
          <Plus className="button-icon" />
          <span>New Goal</span>
        </button>
      </div>

      {showNewGoalForm && (
        <div className="new-goal-overlay">
          <Card className="new-goal-form">
            <CardHeader>
              <CardTitle icon={Target}>Create New Goal</CardTitle>
              <button className="close-form-button" onClick={() => setShowNewGoalForm(false)}>
                ×
              </button>
            </CardHeader>
            <CardContent>
              <div className="form-group">
                <label className="form-label">Goal Type</label>
                <div className="goal-type-buttons">
                  <button
                    className={`goal-type-button ${newGoalType === "daily" ? "active" : ""}`}
                    onClick={() => setNewGoalType("daily")}
                  >
                    <Calendar className="goal-type-icon" />
                    <span>Daily</span>
                  </button>
                  <button
                    className={`goal-type-button ${newGoalType === "weekly" ? "active" : ""}`}
                    onClick={() => setNewGoalType("weekly")}
                  >
                    <Calendar className="goal-type-icon" />
                    <span>Weekly</span>
                  </button>
                  <button
                    className={`goal-type-button ${newGoalType === "project" ? "active" : ""}`}
                    onClick={() => setNewGoalType("project")}
                  >
                    <Target className="goal-type-icon" />
                    <span>Project</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Goal Name</label>
                <input type="text" className="form-input" placeholder="e.g., Complete Chapter 5" />
              </div>

              <div className="form-group">
                <label className="form-label">Target</label>
                <div className="target-input-group">
                  <input type="number" className="form-input" placeholder="1000" />
                  <select className="form-select">
                    <option value="words">Words</option>
                    <option value="pages">Pages</option>
                    <option value="chapters">Chapters</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              </div>

              {newGoalType === "project" && (
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input type="date" className="form-input" />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Associated Book</label>
                <select className="form-select">
                  <option value="">All Books</option>
                  <option value="book1">The Dark Wanderer</option>
                  <option value="book2">Chronicles of Light</option>
                  <option value="book3">Echoes of Tomorrow</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reminder</label>
                <div className="reminder-toggle">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button className="cancel-button" onClick={() => setShowNewGoalForm(false)}>
                Cancel
              </button>
              <button className="create-goal-button">
                <Target className="button-icon" />
                <span>Create Goal</span>
              </button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="goals-container">
        {activeTab === "current" && (
          <div className="current-goals">
            <div className="goals-overview">
              <div className="goal-stat-card">
                <div className="goal-stat-icon">
                  <Target className="stat-icon" />
                </div>
                <div className="goal-stat-content">
                  <div className="goal-stat-value">5</div>
                  <div className="goal-stat-label">Active Goals</div>
                </div>
              </div>

              <div className="goal-stat-card">
                <div className="goal-stat-icon">
                  <Check className="stat-icon" />
                </div>
                <div className="goal-stat-content">
                  <div className="goal-stat-value">3</div>
                  <div className="goal-stat-label">Completed This Week</div>
                </div>
              </div>

              <div className="goal-stat-card">
                <div className="goal-stat-icon">
                  <Trophy className="stat-icon" />
                </div>
                <div className="goal-stat-content">
                  <div className="goal-stat-value">85%</div>
                  <div className="goal-stat-label">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="goals-grid">
              <Card className="goal-card">
                <CardHeader>
                  <CardTitle>Daily Word Count</CardTitle>
                  <div className="goal-type-badge daily">
                    <Calendar className="badge-icon" />
                    <span>Daily</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="goal-progress">
                    <div className="progress-stats">
                      <div className="progress-current">750</div>
                      <div className="progress-target">/ 1,000 words</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "75%" }}></div>
                    </div>
                    <div className="progress-percentage">75%</div>
                  </div>

                  <div className="goal-details">
                    <div className="goal-detail">
                      <Clock className="detail-icon" />
                      <span>Resets in 6 hours</span>
                    </div>
                    <div className="goal-detail">
                      <Target className="detail-icon" />
                      <span>All Books</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="goal-actions">
                    <button className="goal-action-button">
                      <Edit className="action-icon" />
                      <span>Edit</span>
                    </button>
                    <button className="goal-action-button">
                      <Check className="action-icon" />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="goal-card">
                <CardHeader>
                  <CardTitle>Weekly Chapter Goal</CardTitle>
                  <div className="goal-type-badge weekly">
                    <Calendar className="badge-icon" />
                    <span>Weekly</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="goal-progress">
                    <div className="progress-stats">
                      <div className="progress-current">2</div>
                      <div className="progress-target">/ 3 chapters</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "66.7%" }}></div>
                    </div>
                    <div className="progress-percentage">67%</div>
                  </div>

                  <div className="goal-details">
                    <div className="goal-detail">
                      <Clock className="detail-icon" />
                      <span>3 days remaining</span>
                    </div>
                    <div className="goal-detail">
                      <Target className="detail-icon" />
                      <span>The Dark Wanderer</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="goal-actions">
                    <button className="goal-action-button">
                      <Edit className="action-icon" />
                      <span>Edit</span>
                    </button>
                    <button className="goal-action-button">
                      <Check className="action-icon" />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="goal-card">
                <CardHeader>
                  <CardTitle>First Draft Completion</CardTitle>
                  <div className="goal-type-badge project">
                    <Target className="badge-icon" />
                    <span>Project</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="goal-progress">
                    <div className="progress-stats">
                      <div className="progress-current">45,230</div>
                      <div className="progress-target">/ 80,000 words</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "56.5%" }}></div>
                    </div>
                    <div className="progress-percentage">57%</div>
                  </div>

                  <div className="goal-details">
                    <div className="goal-detail">
                      <Calendar className="detail-icon" />
                      <span>Due June 15, 2025</span>
                    </div>
                    <div className="goal-detail">
                      <Target className="detail-icon" />
                      <span>The Dark Wanderer</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="goal-actions">
                    <button className="goal-action-button">
                      <Edit className="action-icon" />
                      <span>Edit</span>
                    </button>
                    <button className="goal-action-button">
                      <Check className="action-icon" />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="goal-card">
                <CardHeader>
                  <CardTitle>Character Development</CardTitle>
                  <div className="goal-type-badge project">
                    <Target className="badge-icon" />
                    <span>Project</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="goal-progress">
                    <div className="progress-stats">
                      <div className="progress-current">4</div>
                      <div className="progress-target">/ 5 characters</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "80%" }}></div>
                    </div>
                    <div className="progress-percentage">80%</div>
                  </div>

                  <div className="goal-details">
                    <div className="goal-detail">
                      <Calendar className="detail-icon" />
                      <span>Due April 20, 2025</span>
                    </div>
                    <div className="goal-detail">
                      <Target className="detail-icon" />
                      <span>Chronicles of Light</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="goal-actions">
                    <button className="goal-action-button">
                      <Edit className="action-icon" />
                      <span>Edit</span>
                    </button>
                    <button className="goal-action-button">
                      <Check className="action-icon" />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="goal-card">
                <CardHeader>
                  <CardTitle>Daily Writing Time</CardTitle>
                  <div className="goal-type-badge daily">
                    <Calendar className="badge-icon" />
                    <span>Daily</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="goal-progress">
                    <div className="progress-stats">
                      <div className="progress-current">1.5</div>
                      <div className="progress-target">/ 2 hours</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "75%" }}></div>
                    </div>
                    <div className="progress-percentage">75%</div>
                  </div>

                  <div className="goal-details">
                    <div className="goal-detail">
                      <Clock className="detail-icon" />
                      <span>Resets in 6 hours</span>
                    </div>
                    <div className="goal-detail">
                      <Target className="detail-icon" />
                      <span>All Books</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="goal-actions">
                    <button className="goal-action-button">
                      <Edit className="action-icon" />
                      <span>Edit</span>
                    </button>
                    <button className="goal-action-button">
                      <Check className="action-icon" />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "completed" && (
          <div className="completed-goals">
            <Card>
              <CardHeader>
                <CardTitle icon={Check}>Completed Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="completed-goals-list">
                  <div className="completed-goal-item">
                    <div className="completed-goal-check">
                      <Check className="check-icon" />
                    </div>
                    <div className="completed-goal-info">
                      <div className="completed-goal-title">Daily Word Count</div>
                      <div className="completed-goal-details">
                        <span className="goal-target">1,000 words</span>
                        <span className="goal-date">April 7, 2025</span>
                      </div>
                    </div>
                    <div className="completed-goal-badge daily">Daily</div>
                  </div>

                  <div className="completed-goal-item">
                    <div className="completed-goal-check">
                      <Check className="check-icon" />
                    </div>
                    <div className="completed-goal-info">
                      <div className="completed-goal-title">Daily Word Count</div>
                      <div className="completed-goal-details">
                        <span className="goal-target">1,000 words</span>
                        <span className="goal-date">April 6, 2025</span>
                      </div>
                    </div>
                    <div className="completed-goal-badge daily">Daily</div>
                  </div>

                  <div className="completed-goal-item">
                    <div className="completed-goal-check">
                      <Check className="check-icon" />
                    </div>
                    <div className="completed-goal-info">
                      <div className="completed-goal-title">Daily Writing Time</div>
                      <div className="completed-goal-details">
                        <span className="goal-target">2 hours</span>
                        <span className="goal-date">April 6, 2025</span>
                      </div>
                    </div>
                    <div className="completed-goal-badge daily">Daily</div>
                  </div>

                  <div className="completed-goal-item">
                    <div className="completed-goal-check">
                      <Check className="check-icon" />
                    </div>
                    <div className="completed-goal-info">
                      <div className="completed-goal-title">Weekly Chapter Goal</div>
                      <div className="completed-goal-details">
                        <span className="goal-target">3 chapters</span>
                        <span className="goal-date">Week of April 1, 2025</span>
                      </div>
                    </div>
                    <div className="completed-goal-badge weekly">Weekly</div>
                  </div>

                  <div className="completed-goal-item">
                    <div className="completed-goal-check">
                      <Check className="check-icon" />
                    </div>
                    <div className="completed-goal-info">
                      <div className="completed-goal-title">Outline Completion</div>
                      <div className="completed-goal-details">
                        <span className="goal-target">Complete outline</span>
                        <span className="goal-date">March 25, 2025</span>
                      </div>
                    </div>
                    <div className="completed-goal-badge project">Project</div>
                  </div>

                  <div className="completed-goal-item">
                    <div className="completed-goal-check">
                      <Check className="check-icon" />
                    </div>
                    <div className="completed-goal-info">
                      <div className="completed-goal-title">World Building</div>
                      <div className="completed-goal-details">
                        <span className="goal-target">Create 5 locations</span>
                        <span className="goal-date">March 20, 2025</span>
                      </div>
                    </div>
                    <div className="completed-goal-badge project">Project</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="goals-analytics">
            <div className="analytics-charts">
              <Card className="completion-rate-chart">
                <CardHeader>
                  <CardTitle icon={BarChart2}>Goal Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="chart-container">
                    <div className="chart-placeholder">
                      <div className="chart-y-axis">
                        <div className="y-axis-label">100%</div>
                        <div className="y-axis-label">75%</div>
                        <div className="y-axis-label">50%</div>
                        <div className="y-axis-label">25%</div>
                        <div className="y-axis-label">0%</div>
                      </div>
                      <div className="chart-content">
                        <div className="chart-grid">
                          <div className="grid-line"></div>
                          <div className="grid-line"></div>
                          <div className="grid-line"></div>
                          <div className="grid-line"></div>
                          <div className="grid-line"></div>
                        </div>
                        <div className="bar-chart">
                          <div className="bar-container">
                            <div className="bar-wrapper">
                              <div className="bar" style={{ height: "90%" }}></div>
                            </div>
                            <div className="bar-label">Daily</div>
                          </div>
                          <div className="bar-container">
                            <div className="bar-wrapper">
                              <div className="bar" style={{ height: "75%" }}></div>
                            </div>
                            <div className="bar-label">Weekly</div>
                          </div>
                          <div className="bar-container">
                            <div className="bar-wrapper">
                              <div className="bar" style={{ height: "60%" }}></div>
                            </div>
                            <div className="bar-label">Project</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="goal-trends-chart">
                <CardHeader>
                  <CardTitle icon={BarChart2}>Goal Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="chart-container">
                    <div className="chart-placeholder">
                      <div className="chart-y-axis">
                        <div className="y-axis-label">100%</div>
                        <div className="y-axis-label">75%</div>
                        <div className="y-axis-label">50%</div>
                        <div className="y-axis-label">25%</div>
                        <div className="y-axis-label">0%</div>
                      </div>
                      <div className="chart-content">
                        <div className="chart-grid">
                          <div className="grid-line"></div>
                          <div className="grid-line"></div>
                          <div className="grid-line"></div>
                          <div className="grid-line"></div>
                          <div className="grid-line"></div>
                        </div>
                        <div className="line-chart">
                          <svg viewBox="0 0 700 300" className="chart-svg">
                            <path
                              d="M50,150 L150,120 L250,180 L350,100 L450,80 L550,120 L650,50"
                              className="chart-line"
                              fill="none"
                              strokeWidth="3"
                            />
                            <path
                              d="M50,150 L150,120 L250,180 L350,100 L450,80 L550,120 L650,50 L650,250 L50,250 Z"
                              className="chart-line-area"
                              fill="url(#gradient)"
                              strokeWidth="0"
                              opacity="0.2"
                            />
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                            </linearGradient>
                            <circle cx="50" cy="150" r="5" className="data-point" />
                            <circle cx="150" cy="120" r="5" className="data-point" />
                            <circle cx="250" cy="180" r="5" className="data-point" />
                            <circle cx="350" cy="100" r="5" className="data-point" />
                            <circle cx="450" cy="80" r="5" className="data-point" />
                            <circle cx="550" cy="120" r="5" className="data-point" />
                            <circle cx="650" cy="50" r="5" className="data-point" />
                          </svg>
                        </div>
                        <div className="chart-x-axis">
                          <div className="x-axis-label">Jan</div>
                          <div className="x-axis-label">Feb</div>
                          <div className="x-axis-label">Mar</div>
                          <div className="x-axis-label">Apr</div>
                          <div className="x-axis-label">May</div>
                          <div className="x-axis-label">Jun</div>
                          <div className="x-axis-label">Jul</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="goal-insights">
              <CardHeader>
                <CardTitle icon={Target}>Goal Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="insights-list">
                  <div className="insight-item">
                    <div className="insight-icon">
                      <Trophy className="icon" />
                    </div>
                    <div className="insight-content">
                      <h3 className="insight-title">Most Successful Goal Type</h3>
                      <p className="insight-description">
                        You complete 90% of your daily goals, making them your most successful goal type. Consider
                        setting more daily goals to maintain momentum.
                      </p>
                    </div>
                  </div>

                  <div className="insight-item">
                    <div className="insight-icon">
                      <Clock className="icon" />
                    </div>
                    <div className="insight-content">
                      <h3 className="insight-title">Optimal Writing Time</h3>
                      <p className="insight-description">
                        Based on your goal completion patterns, you're most productive in the evening. Consider
                        scheduling important writing sessions during this time.
                      </p>
                    </div>
                  </div>

                  <div className="insight-item">
                    <div className="insight-icon">
                      <Target className="icon" />
                    </div>
                    <div className="insight-content">
                      <h3 className="insight-title">Goal Setting Patterns</h3>
                      <p className="insight-description">
                        You tend to set ambitious project goals. Consider breaking them down into smaller weekly goals
                        to improve your completion rate.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default WritingGoals
