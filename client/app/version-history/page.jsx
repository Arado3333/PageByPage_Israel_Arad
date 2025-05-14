"use client"

import { useState } from "react"
import { Clock, Search, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react"
import "../style/VersionHistory.css"

export default function VersionHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVersion, setSelectedVersion] = useState(null)

  return (
    <div className="version-history-container">
      <div className="version-history-header">
        <h1 className="page-title">Version History</h1>
      </div>

      <div className="version-history-content">
        <div className="versions-section">
          <div className="section-header">
            <h2 className="section-title">
              <Clock className="section-icon" />
              Versions
            </h2>
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search versions..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="versions-list">
            {/* Empty versions list */}
            <div className="empty-versions">
              <p>No version history found</p>
            </div>
          </div>
        </div>

        <div className="comparison-section">
          <div className="section-header">
            <h2 className="section-title">
              <RefreshCw className="section-icon" />
              Comparison
            </h2>
            <div className="comparison-navigation">
              <button className="nav-button" disabled={!selectedVersion}>
                <ArrowLeft className="nav-icon" />
                Previous
              </button>
              <button className="nav-button" disabled={!selectedVersion}>
                Next
                <ArrowRight className="nav-icon right" />
              </button>
            </div>
          </div>

          <div className="comparison-content">
            {selectedVersion ? (
              <div className="comparison-view">{/* Comparison view would go here */}</div>
            ) : (
              <div className="empty-comparison">
                <p>Select a version to compare</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
