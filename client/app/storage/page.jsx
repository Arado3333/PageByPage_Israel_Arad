"use client"

import { useState } from "react"
import { Save, Upload, Download, HardDrive, File, FolderOpen } from "lucide-react"
import "../style/Storage.css"

export default function StoragePage() {
  const [activeTab, setActiveTab] = useState("files")

  return (
    <div className="storage-container">
      <div className="storage-header">
        <h1 className="page-title">Storage</h1>

        <div className="storage-actions">
          <button className="storage-button outline">
            <Upload className="button-icon" />
            Import
          </button>
          <button className="storage-button primary">
            <Download className="button-icon" />
            Export
          </button>
        </div>
      </div>

      <div className="storage-tabs">
        <button className={`tab-button ${activeTab === "files" ? "active" : ""}`} onClick={() => setActiveTab("files")}>
          <File className="tab-icon" />
          Files
        </button>
        <button
          className={`tab-button ${activeTab === "backups" ? "active" : ""}`}
          onClick={() => setActiveTab("backups")}
        >
          <Save className="tab-icon" />
          Backups
        </button>
      </div>

      <div className="storage-content">
        {activeTab === "files" ? (
          <div className="files-section">
            <div className="section-header">
              <h2 className="section-title">
                <FolderOpen className="section-icon" />
                My Files
              </h2>
              <div className="storage-info">
                <HardDrive className="info-icon" />
                <span>0 MB used of 1 GB</span>
              </div>
            </div>

            <div className="files-list">
              {/* Empty files list */}
              <div className="empty-files">
                <p>No files found</p>
                <button className="storage-button outline">
                  <Upload className="button-icon" />
                  Upload Files
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="backups-section">
            <div className="section-header">
              <h2 className="section-title">
                <Save className="section-icon" />
                Backups
              </h2>
              <button className="storage-button outline">
                <Save className="button-icon" />
                Create Backup
              </button>
            </div>

            <div className="backups-list">
              {/* Empty backups list */}
              <div className="empty-backups">
                <p>No backups found</p>
                <button className="storage-button outline">
                  <Save className="button-icon" />
                  Create First Backup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
