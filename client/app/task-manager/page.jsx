
"use client"
import '../../app/style/TaskManager.css'
import { Calendar, CheckCircle, Plus, Tag, X } from "lucide-react"
import { useState, useEffect } from "react"

export default function GoalsProgress() {
  // State for interactive functionality
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const [selectedDay, setSelectedDay] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()) // Current month
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()) // Current year
  const [showNewGoalModal, setShowNewGoalModal] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [showDayModal, setShowDayModal] = useState(false)
  const [selectedDayData, setSelectedDayData] = useState(null)

  // Set initial selected day to today if it's in the current month
  useEffect(() => {
    const today = new Date()
    if (today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
      setSelectedDay(today.getDate())
    } else {
      setSelectedDay(null)
    }
  }, [currentMonth, currentYear])

  const [goals, setGoals] = useState([
    { id: 1, title: "Write Chapter 4 introduction", category: "Writing", completed: false },
    { id: 2, title: "Edit Chapter 2 dialogue", category: "Editing", completed: true },
    { id: 3, title: "Create character profile for antagonist", category: "Worldbuilding", completed: false },
    { id: 4, title: "Research medieval weapons", category: "Research", completed: false },
    { id: 5, title: "Outline Chapter 5 plot points", category: "Planning", completed: true },
    { id: 6, title: "Review feedback from beta readers", category: "Editing", completed: false },
    { id: 7, title: "Write 1000 words for Chapter 3", category: "Writing", completed: false },
    { id: 8, title: "Develop setting for new scene", category: "Worldbuilding", completed: false },
    { id: 9, title: "Proofread Chapter 1", category: "Editing", completed: true },
    { id: 10, title: "Brainstorm plot twist ideas", category: "Planning", completed: false },
  ])

  // Sample task data for different months
  const sampleTasksByMonth = {
    0: {
      // January
      3: [
        {
          id: 1,
          title: "Write Chapter 3",
          fullTitle: "Write Chapter 3 - Character Development Scene",
          category: "Writing",
        },
      ],
      5: [
        { id: 2, title: "Edit Chapter 1", fullTitle: "Edit Chapter 1 - Opening Scene Revisions", category: "Editing" },
      ],
      9: [
        { id: 3, title: "Write Ch 4", fullTitle: "Write Chapter 4 - Conflict Introduction", category: "Writing" },
        {
          id: 4,
          title: "Character Dev",
          fullTitle: "Character Development - Antagonist Backstory",
          category: "Worldbuilding",
        },
        { id: 5, title: "Plot Outline", fullTitle: "Plot Outline - Act 2 Structure Planning", category: "Planning" },
      ],
      12: [{ id: 6, title: "Edit Ch 2", fullTitle: "Edit Chapter 2 - Dialogue Polish", category: "Editing" }],
      15: [{ id: 7, title: "Write Ch 5", fullTitle: "Write Chapter 5 - Rising Action", category: "Writing" }],
      18: [
        { id: 8, title: "Worldbuilding", fullTitle: "Worldbuilding - Magic System Rules", category: "Worldbuilding" },
        { id: 9, title: "Plot Review", fullTitle: "Plot Review - Story Arc Analysis", category: "Planning" },
      ],
      22: [{ id: 10, title: "Final Edits", fullTitle: "Final Edits - Manuscript Polish", category: "Editing" }],
    },
    1: {
      // February
      2: [{ id: 11, title: "Character Arc", fullTitle: "Character Arc Development", category: "Planning" }],
      7: [{ id: 12, title: "Write Ch 6", fullTitle: "Write Chapter 6 - Midpoint Scene", category: "Writing" }],
      14: [{ id: 13, title: "Valentine Scene", fullTitle: "Write Valentine's Day Special Scene", category: "Writing" }],
      20: [{ id: 14, title: "Edit Ch 3", fullTitle: "Edit Chapter 3 - Action Sequence", category: "Editing" }],
    },
    2: {
      // March
      5: [{ id: 15, title: "Research", fullTitle: "Research Historical Context", category: "Research" }],
      10: [{ id: 16, title: "Write Ch 7", fullTitle: "Write Chapter 7 - Plot Twist", category: "Writing" }],
      15: [{ id: 17, title: "World Map", fullTitle: "Create Detailed World Map", category: "Worldbuilding" }],
      25: [{ id: 18, title: "Edit Ch 4-5", fullTitle: "Edit Chapters 4 and 5", category: "Editing" }],
    },
  }

  // Initialize calendar tasks with sample data for the current month
  const [calendarTasks, setCalendarTasks] = useState(sampleTasksByMonth[currentMonth] || {})

  // Update tasks when month changes
  useEffect(() => {
    setCalendarTasks(sampleTasksByMonth[currentMonth] || {})
  }, [currentMonth])

  // Form states
  const [newGoalForm, setNewGoalForm] = useState({
    title: "",
    category: "",
    date: "",
  })

  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    category: "",
    date: "",
    day: null,
  })

  // Handle goal completion toggle
  const toggleGoalCompletion = (goalId) => {
    setGoals(goals.map((goal) => (goal.id === goalId ? { ...goal, completed: !goal.completed } : goal)))
    console.log(`Goal ${goalId} toggled`)
  }

  // Handle day selection
  const handleDayClick = (day) => {
    setSelectedDay(day)
    const dayTasks = calendarTasks[day] || []
    setSelectedDayData({ day, tasks: dayTasks })
    setShowDayModal(true)
    console.log(`Selected day: ${day}`)
  }

  // Handle new task button - WORKING NOW
  const handleNewTask = () => {
    setNewTaskForm({ title: "", category: "", date: "", day: null })
    setShowNewTaskModal(true)
    console.log("New task modal opened")
  }

  // Handle new goal button - WORKING NOW
  const handleNewGoal = () => {
    setNewGoalForm({ title: "", category: "", date: "" })
    setShowNewGoalModal(true)
    console.log("New goal modal opened")
  }

  // Handle adding task to specific day - WORKING NOW
  const handleAddTaskToDay = (day) => {
    setNewTaskForm({ title: "", category: "", date: "", day: day })
    setShowDayModal(false)
    setShowNewTaskModal(true)
    console.log(`Adding task to day ${day}`)
  }

  // Handle goal form submission - WORKING NOW
  const handleGoalSubmit = (e) => {
    e.preventDefault()
    if (newGoalForm.title && newGoalForm.category) {
      const newGoal = {
        id: goals.length + 1,
        title: newGoalForm.title,
        category: newGoalForm.category,
        completed: false,
      }
      setGoals([...goals, newGoal])
      setShowNewGoalModal(false)
      setNewGoalForm({ title: "", category: "", date: "" })
      console.log("New goal created:", newGoal)
    }
  }

  // Handle task form submission - WORKING NOW
  const handleTaskSubmit = (e) => {
    e.preventDefault()
    if (newTaskForm.title && newTaskForm.category) {
      const targetDay = newTaskForm.day || selectedDay
      const newTask = {
        id: Date.now(), // Simple ID generation
        title: newTaskForm.title.length > 12 ? newTaskForm.title.substring(0, 12) : newTaskForm.title,
        fullTitle: newTaskForm.title,
        category: newTaskForm.category,
      }

      setCalendarTasks((prev) => ({
        ...prev,
        [targetDay]: [...(prev[targetDay] || []), newTask],
      }))

      setShowNewTaskModal(false)
      setNewTaskForm({ title: "", category: "", date: "", day: null })
      console.log("New task created:", newTask, "for day", targetDay)
    }
  }

  // Handle task deletion - WORKING NOW
  const handleDeleteTask = (day, taskId) => {
    setCalendarTasks((prev) => ({
      ...prev,
      [day]: prev[day].filter((task) => task.id !== taskId),
    }))
    console.log(`Task ${taskId} deleted from day ${day}`)
  }

  // Handle goal deletion - WORKING NOW
  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter((goal) => goal.id !== goalId))
    console.log(`Goal ${goalId} deleted`)
  }

  // Handle month change with proper calendar update
  const handleMonthChange = (e) => {
    const newMonth = Number.parseInt(e.target.value)
    setCurrentMonth(newMonth)
    setSelectedDay(null) // Reset selected day when changing months
    console.log(`Changed to month: ${monthNames[newMonth]}`)
  }

  // Handle year change with proper calendar update
  const handleYearChange = (e) => {
    const newYear = Number.parseInt(e.target.value)
    setCurrentYear(newYear)
    setSelectedDay(null) // Reset selected day when changing years
    console.log(`Changed to year: ${newYear}`)
  }

  // Close modals with Escape key
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowNewGoalModal(false)
      setShowNewTaskModal(false)
      setShowDayModal(false)
    }
  }

  // Generate calendar days with proper month/year handling
  const generateCalendarDays = () => {
    const days = []

    // Calculate days in the selected month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    // Calculate the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasTask = calendarTasks[day]
      const isSelected = day === selectedDay

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? "selected" : ""} ${hasTask ? "has-tasks" : ""}`}
          tabIndex={0}
          role="button"
          aria-label={`${day} ${monthNames[currentMonth]}, ${currentYear}, ${hasTask ? "has tasks" : "no tasks"}`}
          onClick={() => handleDayClick(day)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleDayClick(day)
            }
          }}
        >
          <div className="day-number">{day}</div>
          {hasTask && (
            <div className="day-tasks">
              {hasTask.slice(0, 2).map((task, idx) => (
                <div key={idx} className={`task-tag ${task.category.toLowerCase()}`} title={task.fullTitle}>
                  {task.title}
                </div>
              ))}
              {hasTask.length > 2 && <div className="more-tasks">+{hasTask.length - 2} more</div>}
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  return (
    <main className="goals-progress-container" onKeyDown={handleKeyDown}>
      <header className="page-header">
        <h1>Goals & Progress</h1>
        <button
          className="new-task-button desktop-only"
          onClick={handleNewTask}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleNewTask()
            }
          }}
        >
          <Plus size={16} />
          New Task
        </button>
      </header>

      <div className="content-container">
        <section className="calendar-section">
          <div className="calendar-header">
            <div className="calendar-icon-wrapper">
              <Calendar className="calendar-icon" />
              <h2>Calendar</h2>
            </div>
            <div className="calendar-controls">
              <select
                className="month-select"
                value={currentMonth}
                onChange={handleMonthChange}
                aria-label="Select month"
              >
                {monthNames.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <select className="year-select" value={currentYear} onChange={handleYearChange} aria-label="Select year">
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
              <button className="new-task-button mobile-only" onClick={handleNewTask}>
                <Plus size={14} />
                New
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            <div className="weekday-header">Sun</div>
            <div className="weekday-header">Mon</div>
            <div className="weekday-header">Tue</div>
            <div className="weekday-header">Wed</div>
            <div className="weekday-header">Thu</div>
            <div className="weekday-header">Fri</div>
            <div className="weekday-header">Sat</div>
            {generateCalendarDays()}
          </div>
        </section>

        <aside className="goals-sidebar">
          <div className="goals-header">
            <h2>Writing Goals</h2>
            <span className="goals-count">{goals.filter((g) => !g.completed).length} remaining</span>
          </div>

          <div className="goals-list">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`goal-item ${goal.completed ? "completed" : ""}`}
                tabIndex={0}
                role="button"
                aria-label={`${goal.title}, ${goal.category}, ${goal.completed ? "completed" : "not completed"}`}
              >
                <div className="goal-checkbox" onClick={() => toggleGoalCompletion(goal.id)}>
                  <CheckCircle className={`checkbox-icon ${goal.completed ? "checked" : ""}`} />
                </div>
                <div className="goal-content" onClick={() => toggleGoalCompletion(goal.id)}>
                  <div className="goal-title">{goal.title}</div>
                  <div className={`goal-category ${goal.category.toLowerCase()}`}>
                    <Tag size={10} />
                    {goal.category}
                  </div>
                </div>
                <button
                  className="goal-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteGoal(goal.id)
                  }}
                  aria-label="Delete goal"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            className="new-goal-button"
            aria-label="Create new goal"
            onClick={handleNewGoal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleNewGoal()
              }
            }}
          >
            <Plus size={16} />
            New Goal
          </button>
        </aside>
      </div>

      {/* Day Details Modal - WORKING */}
      {showDayModal && selectedDayData && (
        <div className="modal-overlay" onClick={() => setShowDayModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Tasks for {monthNames[currentMonth]} {selectedDayData.day}, {currentYear}
              </h3>
              <button className="modal-close" onClick={() => setShowDayModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {selectedDayData.tasks.length > 0 ? (
                <div className="day-tasks-list">
                  {selectedDayData.tasks.map((task) => (
                    <div key={task.id} className={`task-item ${task.category.toLowerCase()}`}>
                      <div className="task-content">
                        <div className="task-title">{task.fullTitle || task.title}</div>
                        <div className="task-category">{task.category}</div>
                      </div>
                      <button
                        className="task-delete"
                        onClick={() => handleDeleteTask(selectedDayData.day, task.id)}
                        aria-label="Delete task"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-tasks">No tasks scheduled for this day</p>
              )}
              <button className="add-task-btn" onClick={() => handleAddTaskToDay(selectedDayData.day)}>
                <Plus size={16} />
                Add Task to This Day
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Goal Modal - WORKING */}
      {showNewGoalModal && (
        <div className="modal-overlay" onClick={() => setShowNewGoalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Goal</h3>
              <button className="modal-close" onClick={() => setShowNewGoalModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <form className="goal-form" onSubmit={handleGoalSubmit}>
                <div className="form-group">
                  <label htmlFor="goal-title">Goal Title</label>
                  <input
                    type="text"
                    id="goal-title"
                    placeholder="e.g., Write Chapter 5"
                    value={newGoalForm.title}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="goal-category">Category</label>
                  <select
                    id="goal-category"
                    value={newGoalForm.category}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Writing">Writing</option>
                    <option value="Editing">Editing</option>
                    <option value="Worldbuilding">Worldbuilding</option>
                    <option value="Planning">Planning</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="goal-date">Target Date (Optional)</label>
                  <input
                    type="date"
                    id="goal-date"
                    value={newGoalForm.date}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, date: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowNewGoalModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal - WORKING */}
      {showNewTaskModal && (
        <div className="modal-overlay" onClick={() => setShowNewTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {newTaskForm.day ? `Add Task to ${monthNames[currentMonth]} ${newTaskForm.day}` : "Create New Task"}
              </h3>
              <button className="modal-close" onClick={() => setShowNewTaskModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <form className="goal-form" onSubmit={handleTaskSubmit}>
                <div className="form-group">
                  <label htmlFor="task-title">Task Title</label>
                  <input
                    type="text"
                    id="task-title"
                    placeholder="e.g., Write opening scene for Chapter 6"
                    value={newTaskForm.title}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="task-category">Category</label>
                  <select
                    id="task-category"
                    value={newTaskForm.category}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Writing">Writing</option>
                    <option value="Editing">Editing</option>
                    <option value="Worldbuilding">Worldbuilding</option>
                    <option value="Planning">Planning</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
                {!newTaskForm.day && (
                  <div className="form-group">
                    <label htmlFor="task-day">Day</label>
                    <select
                      id="task-day"
                      value={newTaskForm.day || selectedDay || 1}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, day: Number.parseInt(e.target.value) })}
                    >
                      {Array.from(
                        { length: new Date(currentYear, currentMonth + 1, 0).getDate() },
                        (_, i) => i + 1,
                      ).map((day) => (
                        <option key={day} value={day}>
                          {monthNames[currentMonth]} {day}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowNewTaskModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
