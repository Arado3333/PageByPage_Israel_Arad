"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import {
  Book,
  Edit,
  FileText,
  Settings,
  Calendar,
  Clock,
  Save,
  MessageSquare,
  Menu,
  X,
  Search,
  LogOut,
  Moon,
  Sun,
} from "lucide-react"
import "../style/AppLayout.css"

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { user, logout, theme, toggleTheme } = useAuth()
  const pathname = usePathname()

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-inner">
          {/* Sidebar header */}
          <div className="sidebar-header">
            <div className="sidebar-header-content">
              <Link href="/dashboard" className="logo-link">
                <Book className="logo-icon" />
                <span className="logo-text">Page by Page</span>
              </Link>
              <button className="sidebar-close-button" onClick={toggleSidebar}>
                <X className="close-icon" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/dashboard" className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}>
                  <FileText className="nav-icon" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/book-editor" className={`nav-link ${pathname === "/book-editor" ? "active" : ""}`}>
                  <Edit className="nav-icon" />
                  <span>Book Editor</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/books" className={`nav-link ${pathname === "/books" ? "active" : ""}`}>
                  <Book className="nav-icon" />
                  <span>My Books</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/drafts" className={`nav-link ${pathname === "/drafts" ? "active" : ""}`}>
                  <FileText className="nav-icon" />
                  <span>Drafts</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/ai-consultant" className={`nav-link ${pathname === "/ai-consultant" ? "active" : ""}`}>
                  <MessageSquare className="nav-icon" />
                  <span>AI Consultant</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/task-manager" className={`nav-link ${pathname === "/task-manager" ? "active" : ""}`}>
                  <Calendar className="nav-icon" />
                  <span>Task Manager</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/storage" className={`nav-link ${pathname === "/storage" ? "active" : ""}`}>
                  <Save className="nav-icon" />
                  <span>Storage</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/version-history" className={`nav-link ${pathname === "/version-history" ? "active" : ""}`}>
                  <Clock className="nav-icon" />
                  <span>Version History</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className={`nav-link ${pathname === "/contact" ? "active" : ""}`}>
                  <MessageSquare className="nav-icon" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="sidebar-footer">
            <div className="time-display">
              <div>{formatTime(currentTime)}</div>
              <div>{formatDate(currentTime)}</div>
            </div>
            <button onClick={logout} className="logout-button">
              <LogOut className="logout-icon" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-container">
        {/* Header */}
        <header className="main-header">
          <div className="header-content">
            <div className="header-left">
              <button className="menu-button" onClick={toggleSidebar}>
                <Menu className="menu-icon" />
              </button>
              <div className="search-container">
                <Search className="search-icon" />
                <input type="text" placeholder="Search..." className="search-input" />
              </div>
            </div>

            <div className="header-right">
              <button onClick={toggleTheme} className="theme-toggle">
                {theme === "dark" ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
              </button>
              <Link href="/settings" className="settings-link">
                <Settings className="settings-icon" />
              </Link>
              <div className="user-avatar">{user?.name?.charAt(0) || "U"}</div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="main-content page-transition">{children}</main>
      </div>
    </div>
  )
}
