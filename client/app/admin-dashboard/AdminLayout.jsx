"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Book, LogOut, Moon, Sun } from "lucide-react";
import "../style/AdminLayout.css";
import { logout } from "../lib/actions.js";

export default function AdminLayout({ children }) {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [formattedDt, setFormattedDt] = useState({
    date: "",
    time: "",
  });

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

  return (
    <div className="admin-layout-container">
      {/* Header Section */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <Link
              href="/admin-dashboard"
              className="admin-logo-link"
              aria-label="Go to Admin Dashboard"
            >
              <Book className="admin-logo-icon" role="img" />
              <span className="admin-logo-text">Page by Page</span>
            </Link>
          </div>
          <div className="admin-header-right">
            <div className="admin-time-display">
              <div>{formattedDt.time}</div>
              <div>{formattedDt.date}</div>
            </div>
            <button
              onClick={() => logout()}
              className="admin-logout-button"
              aria-label="Sign Out"
              type="button"
            >
              <LogOut className="admin-logout-icon" role="img" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="admin-main-content">{children}</main>
    </div>
  );
}
