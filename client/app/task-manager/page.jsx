"use client"

import { useState } from "react"
import { Calendar, Plus, Check, X } from "lucide-react"
import "../style/TaskManager.css"

export default function TaskManagerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" })

  // Generate calendar days
  const generateCalendarDays = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

    const daysInMonth = lastDayOfMonth.getDate()
    const firstDayOfWeek = firstDayOfMonth.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: "", isCurrentMonth: false })
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: i === today.getDate(),
        date,
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const handleAddTask = () => {
    // In a real app, this would save the task to a database
    setShowAddTask(false)
    setNewTask({ title: "", description: "", dueDate: "" })
  }

  return (
    <div className="task-manager-container">
      <div className="task-manager-header">
        <h1 className="page-title">Task Manager</h1>
        <button className="task-button primary" onClick={() => setShowAddTask(true)}>
          <Plus className="button-icon" />
          New Task
        </button>
      </div>

      <div className="task-manager-content">
        <div className="calendar-section">
          <div className="calendar-header">
            <h2 className="section-title">
              <Calendar className="section-icon" />
              Calendar
            </h2>
            <div className="calendar-navigation">
              <select className="month-select">
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
              <select className="year-select">
                <option>2023</option>
                <option>2024</option>
                <option>2025</option>
              </select>
            </div>
          </div>

          <div className="calendar-grid">
            <div className="calendar-days">
              <div className="day-name">Sun</div>
              <div className="day-name">Mon</div>
              <div className="day-name">Tue</div>
              <div className="day-name">Wed</div>
              <div className="day-name">Thu</div>
              <div className="day-name">Fri</div>
              <div className="day-name">Sat</div>
            </div>
            <div className="calendar-dates">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-date ${!day.isCurrentMonth ? "other-month" : ""} ${day.isToday ? "today" : ""} ${
                    day.date && selectedDate && day.date.toDateString() === selectedDate.toDateString()
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => day.date && handleDateClick(day.date)}
                >
                  {day.day}
                  {day.isCurrentMonth && day.day && <div className="date-indicator"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <h2 className="section-title">
              <Check className="section-icon" />
              Tasks
            </h2>
            <div className="tasks-date">
              {selectedDate &&
                selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </div>
          </div>

          <div className="tasks-list">
            {/* Empty task list */}
            <div className="empty-tasks">
              <p>No tasks for this day</p>
              <button className="task-button outline" onClick={() => setShowAddTask(true)}>
                <Plus className="button-icon" />
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddTask && (
        <div className="task-modal-overlay">
          <div className="task-modal">
            <div className="modal-header">
              <h3 className="modal-title">Add New Task</h3>
              <button className="modal-close" onClick={() => setShowAddTask(false)}>
                <X className="close-icon" />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="taskTitle" className="form-label">
                  Title
                </label>
                <input
                  id="taskTitle"
                  type="text"
                  className="form-input"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskDescription" className="form-label">
                  Description
                </label>
                <textarea
                  id="taskDescription"
                  className="form-textarea"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="taskDueDate" className="form-label">
                  Due Date
                </label>
                <input
                  id="taskDueDate"
                  type="date"
                  className="form-input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="task-button outline" onClick={() => setShowAddTask(false)}>
                Cancel
              </button>
              <button className="task-button primary" onClick={handleAddTask}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
