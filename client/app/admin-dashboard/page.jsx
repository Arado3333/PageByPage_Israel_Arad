"use client";

import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  FileText,
  BarChart,
  Settings,
  Shield,
} from "lucide-react";
import "../style/AdminDashboard.css";
import UserManagement from "./components/UserManagement";
import SystemLogs from "./components/SystemLogs";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AISettings from "./components/AISettings";
import SystemSettings from "./components/SystemSettings";
import BookManagement from "./components/BookManagement";
import { logAuthEvent } from "../lib/logManager";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Log admin dashboard access
  useEffect(() => {
    logAuthEvent("Admin dashboard accessed", null, "admin", {
      action: "access_admin_dashboard",
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <div className="admin-badge">
          <Shield className="badge-icon" />
          Admin Access
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <BarChart className="tab-icon" />
          Analytics
        </button>
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users className="tab-icon" />
          Users
        </button>
        <button
          className={`tab-button ${activeTab === "books" ? "active" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          <BookOpen className="tab-icon" />
          Books
        </button>
        <button
          className={`tab-button ${activeTab === "logs" ? "active" : ""}`}
          onClick={() => setActiveTab("logs")}
        >
          <FileText className="tab-icon" />
          Logs
        </button>
        <button
          className={`tab-button ${
            activeTab === "ai-settings" ? "active" : ""
          }`}
          onClick={() => setActiveTab("ai-settings")}
        >
          <Settings className="tab-icon" />
          AI Settings
        </button>
        <button
          className={`tab-button ${
            activeTab === "system-settings" ? "active" : ""
          }`}
          onClick={() => setActiveTab("system-settings")}
        >
          <Shield className="tab-icon" />
          System Settings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            <AnalyticsDashboard />
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-section">
            <UserManagement />
          </div>
        )}

        {activeTab === "books" && (
          <div className="books-section">
            <BookManagement />
          </div>
        )}

        {activeTab === "logs" && (
          <div className="logs-section">
            <SystemLogs />
          </div>
        )}

        {activeTab === "ai-settings" && (
          <div className="ai-settings-section">
            <AISettings />
          </div>
        )}

        {activeTab === "system-settings" && (
          <div className="system-settings-section">
            <SystemSettings />
          </div>
        )}
      </div>
    </div>
  );
}
