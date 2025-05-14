"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Book, Edit, FileText, Settings, Calendar, Clock, Save, MessageSquare, Menu, X, Search } from "lucide-react"
import "./style/ClientLayout.css"

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

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
              <Link href="/" className="logo-link">
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
                <Link href="/" className="nav-link">
                  <FileText className="nav-icon" />
                  <span>Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/book-editor" className="nav-link">
                  <Edit className="nav-icon" />
                  <span>Book Editor</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/books" className="nav-link">
                  <Book className="nav-icon" />
                  <span>My Books</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/drafts" className="nav-link">
                  <FileText className="nav-icon" />
                  <span>Drafts</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/ai-consultant" className="nav-link">
                  <MessageSquare className="nav-icon" />
                  <span>AI Consultant</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/task-manager" className="nav-link">
                  <Calendar className="nav-icon" />
                  <span>Task Manager</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/storage" className="nav-link">
                  <Save className="nav-icon" />
                  <span>Storage</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/version-history" className="nav-link">
                  <Clock className="nav-icon" />
                  <span>Version History</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className="nav-link">
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
              <Link href="/settings" className="settings-link">
                <Settings className="settings-icon" />
              </Link>
              <div className="user-avatar">U</div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
