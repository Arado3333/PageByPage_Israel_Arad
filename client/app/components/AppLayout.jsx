"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import "../style/AppLayout.css";
import { logout } from "../lib/actions.js";

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
                href: "/book-editor-v2",
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
];

export default function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(() => new Date());
    const [formattedDt, setFormattedDt] = useState({
        date: "",
        time: "",
    });
    const pathname = usePathname();

    // Format time
    const formatTime = (date) => {
        if (!date || !(date instanceof Date) || isNaN(date)) return "";
        return date.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Format date
    const formatDate = (date) => {
        if (!date || !(date instanceof Date) || isNaN(date)) return "";
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Update time every minute
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now);
            setFormattedDt({
                date: formatDate(now),
                time: formatTime(now),
            });
        };
        updateTime(); // initial
        const timer = setInterval(updateTime, 60000);
        return () => clearInterval(timer);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="layout-container">
            {/* Sidebar Section */}
            <section
                className={`sidebar-section sidebar ${
                    sidebarOpen ? "sidebar-open" : ""
                }`}
            >
                <div className="sidebar-inner">
                    {/* Sidebar header */}
                    <div className="sidebar-header">
                        <div className="sidebar-header-content">
                            <Link
                                href="/dashboard"
                                className="logo-link"
                                aria-label="Go to Dashboard"
                            >
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
                    <nav
                        className="sidebar-nav"
                        aria-label="Sidebar Navigation"
                    >
                        {sidebarNavGroups.map((group, idx) => (
                            <ul className="nav-list" key={group.group || idx}>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li
                                            className="nav-item"
                                            key={item.href}
                                        >
                                            <Link
                                                href={item.href}
                                                className={`nav-link ${
                                                    pathname === item.href
                                                        ? "active"
                                                        : ""
                                                }`}
                                                aria-label={item.aria}
                                            >
                                                <Icon
                                                    className="nav-icon"
                                                    role="img"
                                                />
                                                <span>{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        ))}
                    </nav>

                    {/* Sidebar footer */}
                    <footer className="sidebar-footer">
                        <div className="time-display">
                            <div>{formattedDt.time}</div>
                            <div>{formattedDt.date}</div>
                        </div>
                        <button
                            onClick={() => logout()} //TODO --> Add logout action//
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
                                // onClick={toggleTheme} //TODO --> Toggle theme handler
                                className="theme-toggle"
                                // aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                                type="button"
                            >
                                {/* {theme === "dark" ? (
                  <Sun className="theme-icon" role="img" />
                ) : (
                  <Moon className="theme-icon" role="img" />
                )} */}
                            </button>
                            <Link
                                href="/settings"
                                className="settings-link"
                                aria-label="Go to Settings"
                            >
                                <Settings
                                    className="settings-icon"
                                    role="img"
                                />
                            </Link>
                            <div
                                className="user-avatar"
                                aria-label="User avatar"
                            >
                                {/* {user?.name?.charAt(0) || "U"} */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main content area */}
                <main className="main-content page-transition">{children}</main>
            </section>
        </div>
    );
}
