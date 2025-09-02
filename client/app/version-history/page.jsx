"use client";
import {
  getProjectsWithCookies,
  getTokenFromCookies,
  getVersions,
} from "../api/routes";
import "../style/VersionHistory.css";

import { useState, useMemo, useEffect } from "react";
import PageTransition from "../components/PageTransition";

const VersionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [fetchedProjects, setFetchedProjects] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Version data - will be populated from API
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    getProjectsFromServer();
  }, []);

  async function getProjectsFromServer() {
    const projects = await getProjectsWithCookies();
    setFetchedProjects(projects);
  }

  // Filter versions based on search
  const filteredVersions = useMemo(() => {
    return versions.filter((version) =>
      version.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [versions, searchTerm]);

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);
  const selectedIndex = versions.findIndex((v) => v.id === selectedVersionId);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "draft":
        return { label: "Draft", className: "status-draft" };
      case "final":
        return { label: "Final", className: "status-final" };
      default:
        return { label: "Draft", className: "status-draft" };
    }
  };

  // Enhanced diff generation that handles draft additions and modifications
  const generateDiff = (current, previous) => {
    if (!current || !previous) return null;

    const currentLines = current.content.split("\n");
    const previousLines = previous.content.split("\n");
    const maxLines = Math.max(currentLines.length, previousLines.length);
    const diff = [];

    for (let i = 0; i < maxLines; i++) {
      const currentLine = currentLines[i] || "";
      const previousLine = previousLines[i] || "";

      if (currentLine === previousLine) {
        diff.push({ type: "unchanged", content: currentLine });
      } else if (!previousLine) {
        diff.push({ type: "added", content: currentLine });
      } else if (!currentLine) {
        diff.push({ type: "removed", content: previousLine });
      } else {
        // Line changed - show both
        diff.push({ type: "removed", content: previousLine });
        diff.push({ type: "added", content: currentLine });
      }
    }
    return diff;
  };

  // Generate diff for draft changes (when drafts are added/removed/modified)
  const generateDraftDiff = (currentVersion, previousVersion) => {
    if (!currentVersion || !previousVersion) return null;

    const currentDrafts = currentVersion.drafts || [];
    const previousDrafts = previousVersion.drafts || [];

    const diff = [];

    // Check for added drafts
    currentDrafts.forEach((draft, index) => {
      const prevDraft = previousDrafts[index];
      if (!prevDraft) {
        // New draft added
        diff.push({
          type: "draft-added",
          content: `+ New draft: ${draft.title || "Untitled Draft"}`,
          draft: draft,
        });
      } else if (
        draft.id !== prevDraft.id ||
        draft.content !== prevDraft.content
      ) {
        // Draft modified
        diff.push({
          type: "draft-modified",
          content: `~ Modified draft: ${draft.title || "Untitled Draft"}`,
          draft: draft,
          previousDraft: prevDraft,
        });
      }
    });

    // Check for removed drafts
    previousDrafts.forEach((draft, index) => {
      const currentDraft = currentDrafts[index];
      if (!currentDraft) {
        diff.push({
          type: "draft-removed",
          content: `- Removed draft: ${draft.title || "Untitled Draft"}`,
          draft: draft,
        });
      }
    });

    return diff;
  };

  const currentDiff =
    selectedVersion && selectedIndex > 0
      ? generateDiff(selectedVersion, versions[selectedIndex - 1])
      : null;

  const currentDraftDiff =
    selectedVersion && selectedIndex > 0
      ? generateDraftDiff(selectedVersion, versions[selectedIndex - 1])
      : null;

  // Event handlers

  async function handleShowVersions(e) {
    setIsLoading(true);
    const token = getTokenFromCookies();

    const name = e.target.value.split(", ")[0];
    const project = fetchedProjects.filter((project) => project.title === name);

    setSelectedProject(project[0]);

    try {
      const result = await getVersions(project, token);

      if (result.success && result.versions) {
        // Map DB version objects to UI version objects
        const mappedVersions = result.versions.map((ver, index) => {
          // Use the first draft in the drafts array for display
          const draft =
            Array.isArray(ver.drafts) && ver.drafts.length > 0
              ? ver.drafts[0]
              : {};

          // Flatten pages if present
          let fullContent = "";
          if (Array.isArray(draft.pages) && draft.pages.length > 0) {
            // Join all page contents with double newlines
            fullContent = draft.pages.map((p) => p.content || "").join("\n\n");
          } else {
            fullContent = draft.content || draft.draftContent || "";
          }

          // Calculate total word count from all drafts
          const totalWordCount = (ver.drafts || []).reduce((sum, d) => {
            return sum + (d.wordCount || 0);
          }, 0);

          return {
            id: ver.versionId || ver._id, // Use versionId as unique id
            title: draft.title || `Version ${index + 1}`,
            date: ver.date ? new Date(ver.date) : new Date(),
            wordCount: totalWordCount,
            status: draft.status || "draft",
            content: fullContent,
            // Keep reference to version object fields
            versionId: ver.versionId,
            projectId: ver.projectId,
            _id: ver._id,
            // Store all drafts for diff comparison
            drafts: ver.drafts || [],
            // Add metadata about changes
            changeType: index === 0 ? "initial" : "modified",
            draftCount: (ver.drafts || []).length,
          };
        });

        setVersions(mappedVersions);

        // Auto-select the latest version
        if (mappedVersions.length > 0) {
          setSelectedVersionId(mappedVersions[mappedVersions.length - 1].id);
        }
      } else {
        console.error("Failed to fetch versions:", result);
        setVersions([]);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
      setVersions([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log("🔍 Version search:", value);
  };

  const handleVersionSelect = (version) => {
    setSelectedVersionId(version.id);
    console.log("📄 Version selected:", version.title);
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const prevVersion = versions[selectedIndex - 1];
      setSelectedVersionId(prevVersion.id);
      console.log("⬅️ Previous version:", prevVersion.title);
    }
  };

  const handleNext = () => {
    if (selectedIndex < versions.length - 1) {
      const nextVersion = versions[selectedIndex + 1];
      setSelectedVersionId(nextVersion.id);
      console.log("➡️ Next version:", nextVersion.title);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16 w-full">
        <div className="version-history">
          {/* Header */}
          <div className="vh-header">
            <h1 className="vh-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl">
              Version History
            </h1>
            <p className="vh-subtitle text-sm 2xl:text-base 3xl:text-lg">
              Compare and track changes across different versions of your work
            </p>

            {!fetchedProjects ? (
              <span className="text-gray mt-2 text-sm 2xl:text-base 3xl:text-lg bg-amber-100">
                Loading Projects...
              </span>
            ) : (
              <select
                id="project"
                className="mt-2 bg-amber-100 p-1 rounded-sm text-sm 2xl:text-base 3xl:text-lg"
                onChange={handleShowVersions}
                defaultValue=""
              >
                <option value="" disabled>
                  Select a project...
                </option>
                {fetchedProjects.map((project, index) => (
                  <option className="border-gray-500" key={index}>
                    {project.title + ", " + project.author}
                  </option>
                ))}
              </select>
            )}

            {selectedProject && (
              <div className="mt-2 text-sm 2xl:text-base 3xl:text-lg text-gray-600">
                <strong>Current Project:</strong> {selectedProject.title}
                {versions.length > 0 && (
                  <span className="ml-4">
                    <strong>Versions:</strong> {versions.length}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="vh-content">
            {/* Left Panel - Versions List */}
            <div className="vh-sidebar">
              <div className="vh-search-container">
                <div className="vh-search-wrapper">
                  <svg
                    className="vh-search-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search versions..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="vh-search-input text-sm 2xl:text-base 3xl:text-lg"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="vh-loading">
                  <div className="loading-spinner"></div>
                  <span className="text-sm 2xl:text-base 3xl:text-lg">
                    Loading versions...
                  </span>
                </div>
              ) : (
                <div className="vh-versions-list">
                  {filteredVersions.length === 0 ? (
                    <div className="vh-empty-versions">
                      <p className="text-sm 2xl:text-base 3xl:text-lg">
                        No versions found
                      </p>
                      {selectedProject && (
                        <p className="text-xs 2xl:text-sm 3xl:text-base text-gray-500">
                          Select a project to view its version history
                        </p>
                      )}
                    </div>
                  ) : (
                    filteredVersions.map((version, index) => {
                      const statusConfig = getStatusConfig(version.status);
                      const isSelected = selectedVersionId === version.id;

                      return (
                        <div
                          key={index}
                          className={`vh-version-item ${
                            isSelected ? "selected" : ""
                          }`}
                          onClick={() => handleVersionSelect(version)}
                        >
                          <div className="vh-version-header">
                            <h4 className="vh-version-title text-sm 2xl:text-base 3xl:text-lg">
                              {version.title}
                            </h4>
                            <span
                              className={`vh-status-badge ${statusConfig.className} text-xs 2xl:text-sm 3xl:text-base`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="vh-version-meta">
                            <span className="vh-version-date text-xs 2xl:text-sm 3xl:text-base">
                              {formatDate(version.date)}
                            </span>
                            <span className="vh-version-words text-xs 2xl:text-sm 3xl:text-base">
                              {version.wordCount.toLocaleString()} words
                            </span>
                          </div>
                          {version.draftCount > 1 && (
                            <div className="vh-version-drafts">
                              <span className="vh-draft-count text-xs 2xl:text-sm 3xl:text-base">
                                {version.draftCount} drafts
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Right Panel - Comparison View */}
            <div className="vh-main">
              {!selectedVersion ? (
                <div className="vh-empty-state">
                  <div className="vh-empty-icon">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <h3 className="vh-empty-title text-lg 2xl:text-xl 3xl:text-2xl">
                    Select a version to compare
                  </h3>
                  <p className="vh-empty-description text-sm 2xl:text-base 3xl:text-lg">
                    Choose a version from the list to view its content and see
                    changes from the previous version.
                  </p>
                </div>
              ) : (
                <>
                  {/* Version Navigation */}
                  <div className="vh-navigation">
                    <div className="vh-nav-info">
                      <h3 className="vh-current-title text-lg 2xl:text-xl 3xl:text-2xl">
                        {selectedVersion.title}
                      </h3>
                      <span className="vh-current-date text-sm 2xl:text-base 3xl:text-lg">
                        {formatDate(selectedVersion.date)}
                      </span>
                    </div>
                    <div className="vh-nav-buttons">
                      <button
                        className="vh-nav-btn text-sm 2xl:text-base 3xl:text-lg"
                        onClick={handlePrevious}
                        disabled={selectedIndex === 0}
                        type="button"
                        aria-label="Previous version"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                        Previous
                      </button>
                      <button
                        className="vh-nav-btn text-sm 2xl:text-base 3xl:text-lg"
                        onClick={handleNext}
                        disabled={selectedIndex === versions.length - 1}
                        type="button"
                        aria-label="Next version"
                      >
                        Next
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content Comparison */}
                  <div className="vh-comparison">
                    <div className="vh-comparison-header">
                      <h4 className="vh-comparison-title text-base 2xl:text-lg 3xl:text-xl">
                        {selectedIndex === 0
                          ? "Original Version"
                          : `Changes from "${
                              versions[selectedIndex - 1].title
                            }"`}
                      </h4>
                      <div className="vh-word-count text-sm 2xl:text-base 3xl:text-lg">
                        {selectedVersion.wordCount.toLocaleString()} words
                      </div>
                    </div>

                    {/* Show draft changes if any */}
                    {currentDraftDiff && currentDraftDiff.length > 0 && (
                      <div className="vh-draft-changes">
                        <h5 className="vh-draft-changes-title text-sm 2xl:text-base 3xl:text-lg">
                          Draft Changes:
                        </h5>
                        <div className="vh-draft-changes-list">
                          {currentDraftDiff.map((change, index) => (
                            <div
                              key={index}
                              className={`vh-draft-change ${change.type}`}
                            >
                              <span className="vh-draft-change-marker">
                                {change.type === "draft-added" && "+"}
                                {change.type === "draft-removed" && "-"}
                                {change.type === "draft-modified" && "~"}
                              </span>
                              <span className="vh-draft-change-content text-sm 2xl:text-base 3xl:text-lg">
                                {change.content}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="vh-content-area">
                      {selectedIndex === 0 || !currentDiff ? (
                        // Show original content without diff
                        <div className="vh-original-content">
                          {selectedVersion.content
                            .split("\n")
                            .map((line, index) => (
                              <div
                                key={index}
                                className="vh-content-line unchanged text-sm 2xl:text-base 3xl:text-lg"
                              >
                                {line || "\u00A0"}
                              </div>
                            ))}
                        </div>
                      ) : (
                        // Show diff
                        <div className="vh-diff-content">
                          {currentDiff.map((line, index) => (
                            <div
                              key={index}
                              className={`vh-content-line ${line.type} text-sm 2xl:text-base 3xl:text-lg`}
                            >
                              {line.type === "added" && (
                                <span className="vh-diff-marker">+</span>
                              )}
                              {line.type === "removed" && (
                                <span className="vh-diff-marker">-</span>
                              )}
                              <span className="vh-line-content">
                                {line.content || "\u00A0"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VersionHistory;
