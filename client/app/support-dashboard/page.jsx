"use client"

import { useState } from "react"
import { MessageSquare, Users } from "lucide-react"
import "../style/SupportDashboard.css"

export default function SupportDashboardPage() {
  const [activeTab, setActiveTab] = useState("tickets")

  return (
    <div className="support-container">
      <div className="support-header">
        <h1 className="page-title">Support Dashboard</h1>
        <div className="support-badge">
          <MessageSquare className="badge-icon" />
          Support Access
        </div>
      </div>

      <div className="support-tabs">
        <button
          className={`tab-button ${activeTab === "tickets" ? "active" : ""}`}
          onClick={() => setActiveTab("tickets")}
        >
          <MessageSquare className="tab-icon" />
          Support Tickets
        </button>
        <button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          <Users className="tab-icon" />
          User Management
        </button>
      </div>

      <div className="support-content">
        {activeTab === "tickets" && (
          <div className="tickets-section">
            <div className="section-header">
              <h2 className="section-title">
                <MessageSquare className="section-icon" />
                Support Tickets
              </h2>
              <div className="ticket-filters">
                <select className="filter-select">
                  <option value="all">All Tickets</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="tickets-list">
              <div className="empty-tickets">
                <p>No support tickets found</p>
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
              <div className="user-filters">
                <select className="filter-select">
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="users-list">
              <div className="empty-users">
                <p>No users found</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
