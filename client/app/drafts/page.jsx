"use client"

import { useState } from "react"
import { FileText, Search, Clock, Edit, Trash, Eye } from "lucide-react"
import "../style/Drafts.css"

export default function DraftsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="drafts-container">
      <div className="drafts-header">
        <h1 className="page-title">Drafts</h1>
      </div>

      <div className="search-card">
        <div className="search-form">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search drafts..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="search-filters">
            <select className="filter-select">
              <option value="all">All Drafts</option>
              <option value="recent">Recent</option>
              <option value="auto-saved">Auto-saved</option>
            </select>

            <select className="filter-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="drafts-card">
        <div className="card-header">
          <h2 className="card-title">
            <FileText className="card-icon" />
            Draft List
          </h2>
        </div>
        <div className="card-content">
          <div className="drafts-list">
            {/* Empty draft items */}
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="draft-item">
                <div className="draft-details">
                  <div className="draft-info">
                    <h3 className="draft-title"></h3>
                    <div className="draft-time">
                      <Clock className="time-icon" />
                    </div>
                    <p className="draft-description"></p>
                  </div>
                  <div className="draft-actions">
                    <button className="draft-action-button">
                      <Eye className="action-icon" />
                    </button>
                    <button className="draft-action-button">
                      <Edit className="action-icon" />
                    </button>
                    <button className="draft-action-button delete">
                      <Trash className="action-icon" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
