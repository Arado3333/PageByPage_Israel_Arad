"use client";
import "../style/VersionHistory.css";

import { useState, useMemo, useEffect } from "react";

const VersionHistory = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVersionId, setSelectedVersionId] = useState(null);
    const [fetchedProjects, setFetchedProjects] = useState(null);

    // Mock version data
    const [versions, setVersions] = useState([
        {
            id: 1,
            title: "Initial Draft",
            date: new Date("2024-01-10T09:30:00"),
            wordCount: 2847,
            status: "draft",
            content: `The old lighthouse stood against the stormy sky, its weathered walls telling stories of countless nights. Sarah approached the heavy wooden door, her heart racing with anticipation.

She had been searching for this place for months, following clues left by her grandmother in an old journal. The key felt cold in her palm as she inserted it into the ancient lock.

The door creaked open, revealing a spiral staircase that disappeared into darkness above. Dust motes danced in the pale light filtering through cracked windows.`,
        },
        {
            id: 2,
            title: "Character Development",
            date: new Date("2024-01-12T14:15:00"),
            wordCount: 3156,
            status: "draft",
            content: `The old lighthouse stood against the stormy sky, its weathered walls telling stories of countless nights. Sarah approached the heavy wooden door, her heart racing with both anticipation and fear.

She had been searching for this place for months, following cryptic clues left by her grandmother in an old leather-bound journal. The brass key felt cold in her trembling palm as she inserted it into the ancient lock.

The door creaked open with a haunting groan, revealing a spiral staircase that disappeared into darkness above. Dust motes danced in the pale light filtering through cracked windows, creating an almost ethereal atmosphere.`,
        },
        {
            id: 3,
            title: "Plot Revision",
            date: new Date("2024-01-14T16:45:00"),
            wordCount: 3421,
            status: "draft",
            content: `The old lighthouse stood defiantly against the stormy sky, its weathered stone walls telling stories of countless nights. Sarah approached the heavy wooden door, her heart racing with both anticipation and fear.

She had been searching for this place for months, following cryptic clues left by her grandmother in an old leather-bound journal. The brass key felt cold in her trembling palm as she inserted it into the ancient lock.

The door creaked open with a haunting groan, revealing a spiral staircase that disappeared into darkness above. Dust motes danced in the pale light filtering through cracked windows, creating an almost ethereal atmosphere.

As she stepped inside, the floorboards groaned beneath her feet, and she noticed strange symbols carved into the wooden banister.`,
        },
        {
            id: 4,
            title: "Final Review",
            date: new Date("2024-01-16T11:20:00"),
            wordCount: 3398,
            status: "final",
            content: `The old lighthouse stood defiantly against the stormy sky, its weathered stone walls telling stories of countless nights. Sarah approached the heavy wooden door, her heart racing with anticipation and nervous energy.

She had been searching for this place for months, following cryptic clues left by her grandmother in an old leather-bound journal. The brass key felt cold in her trembling palm as she inserted it into the ancient lock.

The door creaked open with a haunting groan, revealing a spiral staircase that disappeared into darkness above. Dust motes danced in the pale light filtering through cracked windows, creating an almost ethereal atmosphere.

As she stepped inside, the floorboards groaned beneath her feet, and she noticed intricate symbols carved into the wooden banister.`,
        },
        {
            id: 5,
            title: "Published Version",
            date: new Date("2024-01-18T10:00:00"),
            wordCount: 3445,
            status: "final",
            content: `The old lighthouse stood defiantly against the stormy sky, its weathered stone walls telling stories of countless nights and forgotten secrets. Sarah approached the heavy wooden door, her heart racing with anticipation and nervous energy.

She had been searching for this place for months, following cryptic clues left by her grandmother in an old leather-bound journal. The brass key felt cold in her trembling palm as she inserted it into the ancient lock.

The door creaked open with a haunting groan, revealing a spiral staircase that disappeared into darkness above. Dust motes danced in the pale light filtering through cracked windows, creating an almost ethereal atmosphere.

As she stepped inside, the floorboards groaned beneath her feet, and she noticed intricate symbols carved into the wooden banister. Each symbol seemed to pulse with an otherworldly energy.`,
        },
    ]);

    useEffect(() => {
        async function getVersionsFromServer(projectId) {
            const response = await fetch(
                `http://localhost:5500/api/versions/${projectId}`
            );
            return await response.json();
        }

        getProjectsFromServer();
        const versions = getVersionsFromServer().then((res) =>
            console.log(res.versions)
        );
    }, []);

    async function getProjectsFromServer() {
        const { userID, token } = JSON.parse(sessionStorage.getItem("user"));

        const response = await fetch(
            `http://localhost:5500/api/projects/${userID}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const projects = await response.json();

        setFetchedProjects(projects); //TODO: Handle versions render + changing the version objects with appropriate fields.
    }

    // Filter versions based on search
    const filteredVersions = useMemo(() => {
        return versions.filter(
            (version) =>
                version.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                version.date
                    .toLocaleDateString()
                    .includes(searchTerm.toLowerCase())
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

    // Generate diff between two versions
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

    const currentDiff =
        selectedVersion && selectedIndex > 0
            ? generateDiff(selectedVersion, versions[selectedIndex - 1])
            : null;

    // Event handlers

    async function handleShowVersions(e) {
        const {userID, token} = JSON.parse(sessionStorage.getItem("user"));

        const name = e.target.value.split(", ")[0];
        const project = fetchedProjects.filter(
            (project) => project.title === name
        );

        const res = await fetch(`http://localhost:5500/api/versions/${project[0]._id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await res.json();

        // console.log(result.versions);
        
        setVersions(result.versions);
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
        <div className="version-history">
            {/* Header */}
            <div className="vh-header">
                <h1 className="vh-title">Version History</h1>
                <p className="vh-subtitle">
                    Compare and track changes across different versions of your
                    work
                </p>

                {!fetchedProjects ? (
                    <span className="text-gray mt-2 text-[1rem] bg-amber-100">
                        Loading Projects...
                    </span>
                ) : (
                    <select
                        id="project"
                        className="mt-2 bg-amber-100 p-1 rounded-sm "
                        onClick={handleShowVersions}
                    >
                        {fetchedProjects.map((project, index) => (
                            <option className="border-gray-500" key={index}>
                                {" "}
                                {/* can add custom component with the options */}
                                {project.title + ", " + project.author}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="vh-content">
                {/* Left Panel - Versions List */}
                <div className="vh-sidebar">
                    <div className="vh-search-container">
                        <div className="vh-search-wrapper">
                            <svg
                                className="vh-search-icon"
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
                                className="vh-search-input"
                            />
                        </div>
                    </div>

                    <div className="vh-versions-list">
                        {filteredVersions.map((version) => {
                            const statusConfig = getStatusConfig(
                                version.status
                            );
                            const isSelected = selectedVersionId === version.id;

                            return (
                                <div
                                    key={version.id}
                                    className={`vh-version-item ${
                                        isSelected ? "selected" : ""
                                    }`}
                                    onClick={() => handleVersionSelect(version)}
                                >
                                    <div className="vh-version-header">
                                        <h4 className="vh-version-title">
                                            {version.title}
                                        </h4>
                                        <span
                                            className={`vh-status-badge ${statusConfig.className}`}
                                        >
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                    <div className="vh-version-meta">
                                        <span className="vh-version-date">
                                            {formatDate(version.date)}
                                        </span>
                                        <span className="vh-version-words">
                                            {version.wordCount.toLocaleString()}{" "}
                                            words
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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
                            <h3 className="vh-empty-title">
                                Select a version to compare
                            </h3>
                            <p className="vh-empty-description">
                                Choose a version from the list to view its
                                content and see changes from the previous
                                version.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Version Navigation */}
                            <div className="vh-navigation">
                                <div className="vh-nav-info">
                                    <h3 className="vh-current-title">
                                        {selectedVersion.title}
                                    </h3>
                                    <span className="vh-current-date">
                                        {formatDate(selectedVersion.date)}
                                    </span>
                                </div>
                                <div className="vh-nav-buttons">
                                    <button
                                        className="vh-nav-btn"
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
                                        className="vh-nav-btn"
                                        onClick={handleNext}
                                        disabled={
                                            selectedIndex ===
                                            versions.length - 1
                                        }
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
                                    <h4 className="vh-comparison-title">
                                        {selectedIndex === 0
                                            ? "Original Version"
                                            : `Changes from "${
                                                  versions[selectedIndex - 1]
                                                      .title
                                              }"`}
                                    </h4>
                                    <div className="vh-word-count">
                                        {selectedVersion.wordCount.toLocaleString()}{" "}
                                        words
                                    </div>
                                </div>

                                <div className="vh-content-area">
                                    {selectedIndex === 0 || !currentDiff ? (
                                        // Show original content without diff
                                        <div className="vh-original-content">
                                            {selectedVersion.content
                                                .split("\n")
                                                .map((line, index) => (
                                                    <div
                                                        key={index}
                                                        className="vh-content-line unchanged"
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
                                                    className={`vh-content-line ${line.type}`}
                                                >
                                                    {line.type === "added" && (
                                                        <span className="vh-diff-marker">
                                                            +
                                                        </span>
                                                    )}
                                                    {line.type ===
                                                        "removed" && (
                                                        <span className="vh-diff-marker">
                                                            -
                                                        </span>
                                                    )}
                                                    <span className="vh-line-content">
                                                        {line.content ||
                                                            "\u00A0"}
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
    );
};

export default VersionHistory;
