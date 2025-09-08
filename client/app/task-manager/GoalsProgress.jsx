"use client";
import "../../app/style/TaskManager.css";
import "../../app/style/state-button.css";
import {
  Calendar,
  CheckCircle,
  Plus,
  RefreshCw,
  Tag,
  Target,
  X,
} from "lucide-react";
import { useState, useEffect, use } from "react";
import Task from "../lib/models/task.model.js";
import { deleteTask, getTasks, updateTask } from "../api/routes.js";
import {
  saveTasks,
  getTasks as getTasksFromStorage,
  isTaskCacheValid,
  clearTaskCache,
} from "../lib/taskStorage.js";
import StateButton from "../../components/StateButton";
import GoalHeader from "./components/GoalHeader";
import PageTransition from "../components/PageTransition";

export default function GoalsProgress({ goalsPromise }) {
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
  ];

  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Current month
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Current year
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState(null);

  // Set initial selected day to today if it's in the current month
  useEffect(() => {
    const today = new Date();
    if (
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    ) {
      setSelectedDay(today.getDate());
    } else {
      setSelectedDay(null);
    }
  }, [currentMonth, currentYear]);

  const goalsObj = use(goalsPromise);

  const [goals, setGoals] = useState(goalsObj || []);

  const [calendarTasks, setCalendarTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update tasks when month changes
  useEffect(() => {
    fetchAndFilterTasks();
  }, [currentMonth, currentYear]);

  function fetchAndFilterTasks(forceRefresh = false) {
    // If forceRefresh is true, clear the cache first
    if (forceRefresh) {
      clearTaskCache();
    }

    setIsLoading(true);
    getTasksFromServer()
      .then((tasks) => {
        // Group tasks by day for the current month and year
        const grouped = {};
        setAllTasks(tasks);
        tasks
          .filter(
            (task) => task.month === currentMonth && task.year === currentYear
          )
          .forEach((task) => {
            if (!grouped[task.day]) grouped[task.day] = [];
            grouped[task.day].push(task);
          });
        setCalendarTasks(grouped);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Form states
  const [newGoalForm, setNewGoalForm] = useState({
    title: "",
    category: "",
    date: "",
  });

  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    category: "",
    date: "",
    day: null,
  });

  // Handle goal completion toggle
  const toggleGoalCompletion = (goalId) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
    console.log(`Goal ${goalId} toggled`);
  };

  // Handle day selection
  const handleDayClick = (day) => {
    setSelectedDay(day);
    const dayTasks = calendarTasks[day] || [];
    setSelectedDayData({ day, tasks: dayTasks });
    setShowDayModal(true);
    console.log(`Selected day: ${day}`);
  };

  // Handle new task button - WORKING NOW
  const handleNewTask = () => {
    setNewTaskForm({ title: "", category: "", date: "", day: null });
    setShowNewTaskModal(true);
    console.log("New task modal opened");
  };

  // Handle new goal button - WORKING NOW
  const handleNewGoal = () => {
    setNewGoalForm({ title: "", category: "", date: "" });
    setShowNewGoalModal(true);
    console.log("New goal modal opened");
  };

  // Handle adding task to specific day - WORKING NOW
  const handleAddTaskToDay = (day) => {
    setNewTaskForm({ title: "", category: "", date: "", day: day });
    setShowDayModal(false);
    setShowNewTaskModal(true);
    console.log(`Adding task to day ${day}`);
  };

  // Handle goal form submission - WORKING NOW
  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (newGoalForm.title && newGoalForm.category) {
      const newGoal = {
        id: goals.length + 1,
        title: newGoalForm.title,
        category: newGoalForm.category,
        completed: false,
      };
      setGoals([...goals, newGoal]);
      setShowNewGoalModal(false);
      setNewGoalForm({ title: "", category: "", date: "" });
      console.log("New goal created:", newGoal);
    }
  };

  async function getTasksFromServer() {
    // First check if we have valid cached tasks
    if (isTaskCacheValid()) {
      const cachedTasks = getTasksFromStorage();
      if (cachedTasks && cachedTasks.length > 0) {
        return cachedTasks;
      }
    }

    // If no valid cache, fetch from server
    const tasks = await getTasks();

    // Save to localStorage for future use
    if (tasks && tasks.length > 0) {
      saveTasks(tasks);
    }

    return tasks;
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (newTaskForm.title && newTaskForm.category) {
      const targetDay = newTaskForm.day || selectedDay;

      const newTask = new Task(
        newTaskForm.title.substring(0, 12),
        newTaskForm.title,
        newTaskForm.category,
        targetDay,
        currentMonth,
        currentYear
      );

      const taskToUpdate = { ...newTask };

      const result = await updateTask(taskToUpdate);
      console.log(result); // --> will be indicating success or fail message

      // Update local state
      setCalendarTasks((prev) => {
        const updated = {
          ...prev,
          [targetDay]: [...(prev[targetDay] || []), newTask],
        };
        return updated;
      });

      // Update tasks in localStorage
      const updatedAllTasks = [...allTasks, newTask];
      setAllTasks(updatedAllTasks);
      saveTasks(updatedAllTasks);

      setShowNewTaskModal(false);
      setNewTaskForm({ title: "", category: "", date: "", day: null });
      console.log("New task created:", newTask, "for day", targetDay);
    }
  };

  // Handle task deletion - WORKING NOW
  const handleDeleteTask = async (day, taskId) => {
    const result = await deleteTask(taskId);
    console.log(result);

    // Update calendar tasks state
    setCalendarTasks((prev) => {
      const updated = { ...prev };
      if (updated[day]) {
        updated[day] = updated[day].filter((task) => task._id !== taskId);
        if (updated[day].length === 0) {
          delete updated[day];
        }
      }
      return updated;
    });

    // Update selected day data state
    setSelectedDayData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.filter((task) => task._id !== taskId),
      };
    });

    // Update allTasks state and localStorage
    const updatedAllTasks = allTasks.filter((task) => task._id !== taskId);
    setAllTasks(updatedAllTasks);
    saveTasks(updatedAllTasks);

    setShowDayModal(false);
  };

  // Handle goal deletion - WORKING NOW
  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter((goal) => goal.id !== goalId));
    console.log(`Goal ${goalId} deleted`);
  };

  // Handle month change with proper calendar update
  const handleMonthChange = async (e) => {
    const newMonth = Number.parseInt(e.target.value);
    setCurrentMonth(newMonth);
    setSelectedDay(null); // Reset selected day when changing months

    const grouped = {};
    const filtered = allTasks.filter((task) => task.month === newMonth);

    filtered.forEach((task) => {
      if (!grouped[task.day]) grouped[task.day] = [];
      grouped[task.day].push(task);
    });

    setCalendarTasks(grouped);
    console.log(`Changed to month: ${monthNames[newMonth]}`);
  };

  // Handle year change with proper calendar update
  const handleYearChange = async (e) => {
    const newYear = Number.parseInt(e.target.value);
    setCurrentYear(newYear);
    setSelectedDay(null); // Reset selected day when changing years
    setCalendarTasks([]);
    console.log(`Changed to year: ${newYear}`);
  };

  // Close modals with Escape key
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowNewGoalModal(false);
      setShowNewTaskModal(false);
      setShowDayModal(false);
    }
  };

  // Generate calendar days with proper month/year handling
  const generateCalendarDays = () => {
    const days = [];

    // Calculate days in the selected month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Calculate the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasTask = calendarTasks[day];
      const isSelected = day === selectedDay;

      // Get the primary task color for the day
      const primaryTask = hasTask && hasTask[0];
      const taskColor = primaryTask ? getTaskColor(primaryTask.category) : null;

      days.push(
        <div
          key={day}
          className={`aspect-square rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
            isSelected
              ? "border-indigo-500 bg-indigo-50"
              : hasTask
              ? `border-${taskColor}-300 bg-${taskColor}-50 hover:border-${taskColor}-400`
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
          tabIndex={0}
          role="button"
          aria-label={`${day} ${monthNames[currentMonth]}, ${currentYear}, ${
            hasTask ? "has tasks" : "no tasks"
          }`}
          onClick={() => handleDayClick(day)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleDayClick(day);
            }
          }}
        >
          <div className="p-2 h-full flex flex-col">
            <div className="text-sm 2xl:text-base 3xl:text-lg font-medium text-slate-800 mb-1">
              {day}
            </div>
            {hasTask && (
              <div className="flex-1 flex flex-col gap-1">
                {hasTask.slice(0, 2).map((task, idx) => (
                  <div
                    key={idx}
                    className={`text-xs px-2 py-1 rounded-md font-medium truncate ${task.category.toLowerCase()}`}
                    title={task.fullTitle}
                  >
                    {task.title}
                  </div>
                ))}
                {hasTask.length > 2 && (
                  <div className="text-xs text-slate-500 text-center">
                    +{hasTask.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  // Helper function to get task color class
  const getTaskColor = (category) => {
    const colorMap = {
      Writing: "blue",
      Editing: "red",
      Worldbuilding: "green",
      Planning: "amber",
      Research: "cyan",
    };
    return colorMap[category] || "slate";
  };

  return (
    <PageTransition>
      <main
        className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16 w-full"
        onKeyDown={handleKeyDown}
      >
        <GoalHeader  onNewTask={handleNewTask}/>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
          {/* Calendar Section */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 2xl:mb-8 3xl:mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 lg:w-6 lg:h-6 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="font-serif text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-[#0F1A2E]">
                        Calendar
                      </h2>
                      <p className="text-sm 2xl:text-base 3xl:text-lg text-slate-600">
                        {monthNames[currentMonth]} {currentYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <select
                      className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-sm 2xl:text-base 3xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    <select
                      className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-sm 2xl:text-base 3xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={currentYear}
                      onChange={handleYearChange}
                      aria-label="Select year"
                    >
                      <option value={2022}>2022</option>
                      <option value={2023}>2023</option>
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                    </select>
                    <StateButton
                      icon={<RefreshCw />}
                      state={isLoading}
                      loadingText={" "}
                      handlerFunction={() => fetchAndFilterTasks(true)}
                    />
                    <button
                      className="lg:hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 text-sm flex items-center gap-2 hover:opacity-90"
                      onClick={handleNewTask}
                    >
                      <Plus size={14} />
                      New
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 h-full">
                    {/* Weekday headers */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-xs 2xl:text-sm 3xl:text-base font-medium text-slate-500 py-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                    {/* Calendar days */}
                    {generateCalendarDays()}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Goals Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 2xl:mb-8 3xl:mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 lg:w-6 lg:h-6 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="font-serif text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-[#0F1A2E]">
                        Writing Goals
                      </h2>
                      <p className="text-sm 2xl:text-base 3xl:text-lg text-slate-600">
                        {goals.filter((g) => !g.completed).length} remaining
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className={`rounded-xl p-4 border transition-all duration-200 hover:shadow-md ${
                        goal.completed
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-white border-slate-200 hover:border-amber-300"
                      }`}
                      tabIndex={0}
                      role="button"
                      aria-label={`${goal.title}, ${goal.category}, ${
                        goal.completed ? "completed" : "not completed"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center hover:border-amber-500 transition-colors"
                          onClick={() => toggleGoalCompletion(goal.id)}
                        >
                          {goal.completed && (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-800 text-sm 2xl:text-base 3xl:text-lg">
                            {goal.title}
                          </div>
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium mt-2 ${goal.category.toLowerCase()}`}
                          >
                            <Tag size={10} />
                            {goal.category}
                          </div>
                        </div>
                        <button
                          className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGoal(goal.id);
                          }}
                          aria-label="Delete goal"
                        >
                          <X size={14} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 font-medium text-sm 2xl:text-base 3xl:text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  aria-label="Create new goal"
                  onClick={handleNewGoal}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNewGoal();
                    }
                  }}
                >
                  <Plus size={16} />
                  New Goal
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Day Details Modal - WORKING */}
        {showDayModal && selectedDayData && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDayModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="font-serif text-xl 2xl:text-2xl 3xl:text-3xl text-[#0F1A2E]">
                  Tasks for {monthNames[currentMonth]} {selectedDayData.day},{" "}
                  {currentYear}
                </h3>
                <button
                  className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors"
                  onClick={() => setShowDayModal(false)}
                >
                  <X size={16} className="text-red-600" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {selectedDayData.tasks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDayData.tasks.map((task, index) => (
                      <div
                        key={index}
                        className={`rounded-xl p-4 border-l-4 ${
                          task.category === "Writing"
                            ? "border-l-blue-500 bg-blue-50"
                            : task.category === "Editing"
                            ? "border-l-red-500 bg-red-50"
                            : task.category === "Worldbuilding"
                            ? "border-l-green-500 bg-green-50"
                            : task.category === "Planning"
                            ? "border-l-amber-500 bg-amber-50"
                            : task.category === "Research"
                            ? "border-l-cyan-500 bg-cyan-50"
                            : "border-l-slate-500 bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-slate-800 text-sm 2xl:text-base 3xl:text-lg">
                              {task.fullTitle || task.title}
                            </div>
                            <div className="text-xs 2xl:text-sm 3xl:text-base text-slate-600 mt-1">
                              {task.category}
                            </div>
                          </div>
                          <button
                            className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors ml-3"
                            onClick={() =>
                              handleDeleteTask(selectedDayData.day, task._id)
                            }
                            aria-label="Delete task"
                          >
                            <X size={14} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 text-sm 2xl:text-base 3xl:text-lg">
                      No tasks scheduled for this day
                    </p>
                  </div>
                )}
                <button
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 font-medium text-sm 2xl:text-base 3xl:text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  onClick={() => handleAddTaskToDay(selectedDayData.day)}
                >
                  <Plus size={16} />
                  Add Task to This Day
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Goal Modal - WORKING */}
        {showNewGoalModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewGoalModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="font-serif text-xl 2xl:text-2xl 3xl:text-3xl text-[#0F1A2E]">
                  Create New Goal
                </h3>
                <button
                  className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors"
                  onClick={() => setShowNewGoalModal(false)}
                >
                  <X size={16} className="text-red-600" />
                </button>
              </div>
              <div className="p-6">
                <form className="space-y-4" onSubmit={handleGoalSubmit}>
                  <div>
                    <label
                      htmlFor="goal-title"
                      className="block text-sm 2xl:text-base 3xl:text-lg font-medium text-slate-700 mb-2"
                    >
                      Goal Title
                    </label>
                    <input
                      type="text"
                      id="goal-title"
                      placeholder="e.g., Write Chapter 5"
                      value={newGoalForm.title}
                      onChange={(e) =>
                        setNewGoalForm({
                          ...newGoalForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm 2xl:text-base 3xl:text-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="goal-category"
                      className="block text-sm 2xl:text-base 3xl:text-lg font-medium text-slate-700 mb-2"
                    >
                      Category
                    </label>
                    <select
                      id="goal-category"
                      value={newGoalForm.category}
                      onChange={(e) =>
                        setNewGoalForm({
                          ...newGoalForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm 2xl:text-base 3xl:text-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                  <div>
                    <label
                      htmlFor="goal-date"
                      className="block text-sm 2xl:text-base 3xl:text-lg font-medium text-slate-700 mb-2"
                    >
                      Target Date (Optional)
                    </label>
                    <input
                      type="date"
                      id="goal-date"
                      value={newGoalForm.date}
                      onChange={(e) =>
                        setNewGoalForm({
                          ...newGoalForm,
                          date: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm 2xl:text-base 3xl:text-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      className="flex-1 rounded-xl border border-slate-200 text-slate-700 py-3 px-4 font-medium text-sm 2xl:text-base 3xl:text-lg hover:bg-slate-50 transition-colors"
                      onClick={() => setShowNewGoalModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 font-medium text-sm 2xl:text-base 3xl:text-lg hover:opacity-90 transition-opacity"
                    >
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
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewTaskModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="font-serif text-xl 2xl:text-2xl 3xl:text-3xl text-[#0F1A2E]">
                  {newTaskForm.day
                    ? `Add Task to ${monthNames[currentMonth]} ${newTaskForm.day}`
                    : "Create New Task"}
                </h3>
                <button
                  className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors"
                  onClick={() => setShowNewTaskModal(false)}
                >
                  <X size={16} className="text-red-600" />
                </button>
              </div>
              <div className="p-6">
                <form className="space-y-4" onSubmit={handleTaskSubmit}>
                  <div>
                    <label
                      htmlFor="task-title"
                      className="block text-sm 2xl:text-base 3xl:text-lg font-medium text-slate-700 mb-2"
                    >
                      Task Title
                    </label>
                    <input
                      type="text"
                      id="task-title"
                      placeholder="e.g., Write opening scene for Chapter 6"
                      value={newTaskForm.title}
                      onChange={(e) =>
                        setNewTaskForm({
                          ...newTaskForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm 2xl:text-base 3xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="task-category"
                      className="block text-sm 2xl:text-base 3xl:text-lg font-medium text-slate-700 mb-2"
                    >
                      Category
                    </label>
                    <select
                      id="task-category"
                      value={newTaskForm.category}
                      onChange={(e) =>
                        setNewTaskForm({
                          ...newTaskForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm 2xl:text-base 3xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    <div>
                      <label
                        htmlFor="task-day"
                        className="block text-sm 2xl:text-base 3xl:text-lg font-medium text-slate-700 mb-2"
                      >
                        Day
                      </label>
                      <select
                        id="task-day"
                        value={newTaskForm.day || selectedDay || 1}
                        onChange={(e) =>
                          setNewTaskForm({
                            ...newTaskForm,
                            day: Number.parseInt(e.target.value),
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm 2xl:text-base 3xl:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        {Array.from(
                          {
                            length: new Date(
                              currentYear,
                              currentMonth + 1,
                              0
                            ).getDate(),
                          },
                          (_, i) => i + 1
                        ).map((day) => (
                          <option key={day} value={day}>
                            {monthNames[currentMonth]} {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      className="flex-1 rounded-xl border border-slate-200 text-slate-700 py-3 px-4 font-medium text-sm 2xl:text-base 3xl:text-lg hover:bg-slate-50 transition-colors"
                      onClick={() => setShowNewTaskModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 font-medium text-sm 2xl:text-base 3xl:text-lg hover:opacity-90 transition-opacity"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </PageTransition>
  );
}
