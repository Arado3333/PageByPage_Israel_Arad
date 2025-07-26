"use client"

import { useState, useEffect, useContext } from "react"
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
import { BookContext } from "../context/BookContext"

// Sidebar navigation structure
const sidebarNavGroups = [
  {
    group: "Main",
    items: [
      {
        href: "/dashboard",
        label: "Overview",
        icon: FileText,
        aria: "Go to Overview",
      },
      {
        href: "/book-editor",
        label: "Writing Studio",
        icon: Edit,
        aria: "Go to Writing Studio",
      },
      {
        href: "/books",
        label: "Library",
        icon: Book,
        aria: "Go to Library",
      },
      {
        href: "/drafts",
        label: "Draft Manager",
        icon: FileText,
        aria: "Go to Draft Manager",
      },
    ],
  },
  {
    group: "Tools",
    items: [
      {
        href: "/ai-consultant",
        label: "AI Assistant",
        icon: MessageSquare,
        aria: "Go to AI Assistant",
      },
      {
        href: "/task-manager",
        label: "Goals & Calendar",
        icon: Calendar,
        aria: "Go to Goals and Calendar",
      },
      {
        href: "/storage",
        label: "Files & Backups",
        icon: Save,
        aria: "Go to Files and Backups",
      },
      {
        href: "/version-history",
        label: "Revision History",
        icon: Clock,
        aria: "Go to Revision History",
      },
      {
        href: "/contact",
        label: "Support & Feedback",
        icon: MessageSquare,
        aria: "Go to Support and Feedback",
      },
    ],
  },
]

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
      {/* Sidebar Section */}
      <section className={`sidebar-section sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-inner">
          {/* Sidebar header */}
          <div className="sidebar-header">
            <div className="sidebar-header-content">
              <Link href="/dashboard" className="logo-link" aria-label="Go to Dashboard">
                <Book className="logo-icon" role="img" />
                <span className="logo-text">Page by Page</span>
              </Link>
              <button
                className="sidebar-close-button"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
                type="button"
              >
                <X className="close-icon" role="img" />
              </button>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="sidebar-nav" aria-label="Sidebar Navigation">
            {sidebarNavGroups.map((group, idx) => (
              <ul className="nav-list" key={group.group || idx}>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li className="nav-item" key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-link ${pathname === item.href ? "active" : ""}`}
                        aria-label={item.aria}
                      >
                        <Icon className="nav-icon" role="img" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ))}
          </nav>

          {/* Sidebar footer */}
          <footer className="sidebar-footer">
            <div className="time-display">
              <div>{formatTime(currentTime)}</div>
              <div>{formatDate(currentTime)}</div>
            </div>
            <button
              onClick={logout}
              className="logout-button"
              aria-label="Sign Out"
              type="button"
            >
              <LogOut className="logout-icon" role="img" />
              <span>Sign Out</span>
            </button>
          </footer>
        </div>
      </section>

      {/* Main Section */}
      <section className="main-section main-container">
        {/* Header Section */}
        <section className="header-section main-header">
          <div className="header-content">
            <div className="header-left">
              <button
                className="menu-button"
                onClick={toggleSidebar}
                aria-label="Open sidebar"
                type="button"
              >
                <Menu className="menu-icon" role="img" />
              </button>
              <div className="search-container">
                <Search className="search-icon" role="img" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  aria-label="Search"
                />
              </div>
            </div>
            <div className="header-right">
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                type="button"
              >
                {theme === "dark" ? (
                  <Sun className="theme-icon" role="img" />
                ) : (
                  <Moon className="theme-icon" role="img" />
                )}
              </button>
              <Link
                href="/settings"
                className="settings-link"
                aria-label="Go to Settings"
              >
                <Settings className="settings-icon" role="img" />
              </Link>
              <div className="user-avatar" aria-label="User avatar">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </section>

        {/* Main content area */}
        <main className="main-content page-transition">{children}</main>
      </section>
    </div>
  )
}
