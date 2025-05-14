"use client"

import { useState } from "react"
import { Users, BookOpen, FileText, BarChart, Settings, Shield } from "lucide-react"
import "../style/AdminDashboard.css"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="admin-container">
      <div className="admin-header">
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
          Overview
        </button>
        <button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          <Users className="tab-icon" />
          Users
        </button>
        <button className={`tab-button ${activeTab === "books" ? "active" : ""}`} onClick={() => setActiveTab("books")}>
          <BookOpen className="tab-icon" />
          Books
        </button>
        <button
          className={`tab-button ${activeTab === "content" ? "active" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          <FileText className="tab-icon" />
          Content
        </button>
        <button
          className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <h3 className="stat-title">Total Users</h3>
                  <Users className="stat-icon" />
                </div>
                <div className="stat-value">0</div>
                <div className="stat-description">Active accounts</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <h3 className="stat-title">Total Books</h3>
                  <BookOpen className="stat-icon" />
                </div>
                <div className="stat-value">0</div>
                <div className="stat-description">Published books</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <h3 className="stat-title">Total Drafts</h3>
                  <FileText className="stat-icon" />
                </div>
                <div className="stat-value">0</div>
                <div className="stat-description">Saved drafts</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-section">
            <div className="section-header">
              <h2 className="section-title">
                <Users className="section-icon" />
                User Management
              </h2>
            </div>
            <div className="users-list">
              <div className="empty-users">
                <p>No users found</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "books" && (
          <div className="books-section">
            <div className="section-header">
              <h2 className="section-title">
                <BookOpen className="section-icon" />
                Book Management
              </h2>
            </div>
            <div className="books-list">
              <div className="empty-books">
                <p>No books found</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">
                <FileText className="section-icon" />
                Content Management
              </h2>
            </div>
            <div className="content-list">
              <div className="empty-content">
                <p>No content found</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-section">
            <div className="section-header">
              <h2 className="section-title">
                <Settings className="section-icon" />
                System Settings
              </h2>
            </div>
            <div className="settings-form">
              <div className="form-group">
                <label className="form-label">Site Name</label>
                <input type="text" className="form-input" placeholder="Page by Page" />
              </div>
              <div className="form-group">
                <label className="form-label">Storage Limit (MB)</label>
                <input type="number" className="form-input" placeholder="1000" />
              </div>
              <div className="form-group">
                <label className="form-label">Allow User Registration</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="registration" className="toggle-input" />
                  <label htmlFor="registration" className="toggle-label"></label>
                </div>
              </div>
              <button className="admin-button primary">Save Settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
