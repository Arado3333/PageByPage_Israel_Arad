"use client";
import "../style/Storage.css";

import { useState } from "react";
import PageTransition from "../components/PageTransition";
import { Sparkles } from "lucide-react";

const Storage = () => {
  const [activeTab, setActiveTab] = useState("files");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Mock data for files
  const [files] = useState([
    {
      id: 1,
      name: "Chapter_1_Draft.docx",
      size: "2.4 MB",
      type: "document",
      dateAdded: new Date("2024-01-15T10:30:00"),
      status: "synced",
    },
    {
      id: 2,
      name: "Character_Notes.pdf",
      size: "856 KB",
      type: "pdf",
      dateAdded: new Date("2024-01-14T16:45:00"),
      status: "synced",
    },
    {
      id: 3,
      name: "Research_Images.zip",
      size: "15.2 MB",
      type: "archive",
      dateAdded: new Date("2024-01-13T09:20:00"),
      status: "failed",
    },
    {
      id: 4,
      name: "Plot_Outline.txt",
      size: "45 KB",
      type: "text",
      dateAdded: new Date("2024-01-12T14:15:00"),
      status: "synced",
    },
    {
      id: 5,
      name: "Audio_Notes_Ch2.mp3",
      size: "8.7 MB",
      type: "audio",
      dateAdded: new Date("2024-01-11T11:30:00"),
      status: "syncing",
    },
  ]);

  // Mock data for backups
  const [backups] = useState([
    {
      id: 1,
      name: "Full_Backup_2024-01-15",
      size: "124 MB",
      type: "backup",
      dateAdded: new Date("2024-01-15T23:00:00"),
      status: "complete",
    },
    {
      id: 2,
      name: "Auto_Backup_2024-01-14",
      size: "98 MB",
      type: "backup",
      dateAdded: new Date("2024-01-14T23:00:00"),
      status: "complete",
    },
    {
      id: 3,
      name: "Manual_Backup_2024-01-10",
      size: "156 MB",
      type: "backup",
      dateAdded: new Date("2024-01-10T15:30:00"),
      status: "complete",
    },
  ]);

  const currentData = activeTab === "files" ? files : backups;

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "document":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        );
      case "pdf":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
          </svg>
        );
      case "archive":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="21,8 21,21 3,21 3,8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
        );
      case "text":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
        );
      case "audio":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        );
      case "backup":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7,10 12,15 17,10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        );
      default:
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
          </svg>
        );
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "synced":
      case "complete":
        return { label: "Synced", className: "status-success" };
      case "syncing":
        return { label: "Syncing", className: "status-warning" };
      case "failed":
        return { label: "Failed", className: "status-error" };
      default:
        return { label: "Unknown", className: "status-muted" };
    }
  };

  // Event Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log("📂 Tab changed to:", tab);
  };

  const handleUpload = () => {
    console.log("⬆️ Upload files clicked");
    alert("Upload functionality would open file picker");
  };

  const handleImport = () => {
    console.log("📥 Import clicked");
    alert("Import functionality would open import dialog");
  };

  const handleExport = () => {
    console.log("📤 Export clicked");
    alert("Export functionality would start export process");
  };

  const handleView = (file) => {
    console.log("👁️ View file:", file.name);
    alert(`Viewing: ${file.name}`);
  };

  const handleDownload = (file) => {
    console.log("📥 Download file:", file.name);
    alert(`Downloading: ${file.name}`);
  };

  const handleDelete = (file) => {
    console.log("🗑️ Delete file:", file.name);
    alert(`Delete: ${file.name}`);
  };

  const handleBackupRestore = (file) => {
    if (activeTab === "files") {
      console.log("💾 Backup file:", file.name);
      alert(`Creating backup of: ${file.name}`);
    } else {
      console.log("🔄 Restore backup:", file.name);
      alert(`Restoring backup: ${file.name}`);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen text-slate-800">
        {/* Decorative blobs */}
        <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-30" />
        </div>

        <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16 w-full">
          {/* Hero Section */}
          <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg">
                <Sparkles className="w-4 h-4" />
                Storage
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-serif text-[#0F1A2E] mb-2">
              Files & Backups
            </h1>
            <p className="text-base sm:text-lg 2xl:text-xl 3xl:text-2xl text-slate-600">
              Manage your writing files, documents, and backup archives
            </p>
          </section>

          <div className="storage">
            {/* Tabs */}
            <div className="storage-tabs">
              <button
                className={`storage-tab text-sm 2xl:text-base 3xl:text-lg ${
                  activeTab === "files" ? "active" : ""
                }`}
                onClick={() => handleTabChange("files")}
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Files
              </button>
              <button
                className={`storage-tab text-sm 2xl:text-base 3xl:text-lg ${
                  activeTab === "backups" ? "active" : ""
                }`}
                onClick={() => handleTabChange("backups")}
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17,10 12,15 7,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Backups
              </button>
            </div>

            {/* Action Buttons */}
            <div className="storage-actions">
              {activeTab === "files" ? (
                <>
                  <button
                    className="storage-action-btn primary text-sm 2xl:text-base 3xl:text-lg bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={handleUpload}
                    type="button"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17,8 12,3 7,8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload Files
                  </button>
                  <button
                    className="storage-action-btn secondary text-sm 2xl:text-base 3xl:text-lg"
                    onClick={handleImport}
                    type="button"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7,10 12,15 17,10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Import
                  </button>
                  <button
                    className="storage-action-btn secondary text-sm 2xl:text-base 3xl:text-lg"
                    onClick={handleExport}
                    type="button"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17,8 12,3 7,8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Export
                  </button>
                </>
              ) : (
                <button
                  className="storage-action-btn primary text-sm 2xl:text-base 3xl:text-lg bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={handleUpload}
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17,8 12,3 7,8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Create Backup
                </button>
              )}
            </div>

            {/* File Grid */}
            <div className="storage-content">
              {currentData.length === 0 ? (
                <div className="storage-empty">
                  <div className="storage-empty-icon">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="storage-empty-title text-lg 2xl:text-xl 3xl:text-2xl">
                    No {activeTab} found
                  </h3>
                  <p className="storage-empty-description text-sm 2xl:text-base 3xl:text-lg">
                    Start by uploading or importing your work to get organized.
                  </p>
                </div>
              ) : (
                <div className="storage-grid">
                  {currentData.map((item) => {
                    const statusConfig = getStatusConfig(item.status);
                    return (
                      <div key={item.id} className="storage-item">
                        <div className="storage-item-header">
                          <div className="storage-item-icon">
                            {getFileIcon(item.type)}
                          </div>
                          <div className="storage-item-info">
                            <h4 className="storage-item-name text-sm 2xl:text-base 3xl:text-lg">
                              {item.name}
                            </h4>
                            <div className="storage-item-meta">
                              <span className="storage-item-size text-xs 2xl:text-sm 3xl:text-base">
                                {item.size}
                              </span>
                              <span className="storage-item-date text-xs 2xl:text-sm 3xl:text-base">
                                {formatDate(item.dateAdded)}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`storage-status ${statusConfig.className} text-xs 2xl:text-sm 3xl:text-base`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>

                        <div className="storage-item-actions">
                          <button
                            className="storage-item-btn view text-xs 2xl:text-sm 3xl:text-base"
                            onClick={() => handleView(item)}
                            type="button"
                            aria-label={`View ${item.name}`}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            View
                          </button>
                          <button
                            className="storage-item-btn download text-xs 2xl:text-sm 3xl:text-base"
                            onClick={() => handleDownload(item)}
                            type="button"
                            aria-label={`Download ${item.name}`}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7,10 12,15 17,10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                          </button>
                          <button
                            className="storage-item-btn backup text-xs 2xl:text-sm 3xl:text-base"
                            onClick={() => handleBackupRestore(item)}
                            type="button"
                            aria-label={
                              activeTab === "files"
                                ? `Backup ${item.name}`
                                : `Restore ${item.name}`
                            }
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              {activeTab === "files" ? (
                                <>
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                  <polyline points="7,10 12,15 17,10"></polyline>
                                  <line x1="12" y1="15" x2="12" y2="3"></line>
                                </>
                              ) : (
                                <>
                                  <polyline points="23 4 23 10 17 10"></polyline>
                                  <polyline points="1 20 1 14 7 14"></polyline>
                                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                                </>
                              )}
                            </svg>
                            {activeTab === "files" ? "Backup" : "Restore"}
                          </button>
                          <button
                            className="storage-item-btn delete text-xs 2xl:text-sm 3xl:text-base"
                            onClick={() => handleDelete(item)}
                            type="button"
                            aria-label={`Delete ${item.name}`}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3,6 5,6 21,6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Storage;
