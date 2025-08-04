"use client";
import "../style/Drafts.css";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Draft from "../lib/models/draft.model.js";
import {
    deleteDraft,
    getProjects,
    getProjectsWithCookies,
    getSession,
    getTokenFromCookies,
} from "../api/routes";

const FADE_DURATION = 350; // ms

const DraftManager = () => {
    const [drafts, setDrafts] = useState([]);
    const [books, setBooks] = useState([]);
    const router = useRouter();

    // Fetch drafts from server for the specific user on mount
    useEffect(() => {
        async function getProjectsFromServer() {
            const projects = await getProjectsWithCookies();
            setBooks(projects);
            // Flatten all drafts from all projects into a single array
            let allDrafts = [];
            projects.forEach((project) => {
                if (Array.isArray(project.drafts)) {
                    project.drafts.forEach((draft) => {
                        allDrafts.push({
                            ...draft,
                            bookName:
                                project.title ||
                                project.bookName ||
                                "Untitled Book",
                            lastModified: draft.lastModified
                                ? new Date(draft.lastModified)
                                : new Date(),
                        });
                    });
                }
            });
            setDrafts(allDrafts);
        }
        getProjectsFromServer();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewDraft, setViewDraft] = useState(null);
    const [editDraft, setEditDraft] = useState(null);
    const [deletingDraftId, setDeletingDraftId] = useState(null);
    const [highlightedDraftId, setHighlightedDraftId] = useState(null);
    const newDraftRef = useRef(null);

    const filteredAndSortedDrafts = useMemo(() => {
        const filtered = drafts.filter((draft) => {
            const matchesSearch =
                draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                draft.snippet
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                draft.bookName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || draft.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.lastModified) - new Date(a.lastModified);
                case "oldest":
                    return new Date(a.lastModified) - new Date(b.lastModified);
                case "a-z":
                    return a.title.localeCompare(b.title);
                case "z-a":
                    return b.title.localeCompare(a.title);
                case "word-count":
                    return b.wordCount - a.wordCount;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [drafts, searchTerm, statusFilter, sortBy]);

    const formatDate = (date) => {
        if (!date) return "";
        const parsedDate = typeof date === "string" ? new Date(date) : date;
        const now = new Date();

        // Calculate difference in days
        const diffTime = now - parsedDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;

        return parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year:
                parsedDate.getFullYear() !== now.getFullYear()
                    ? "numeric"
                    : undefined,
        });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "draft":
                return { label: "Draft", className: "status-draft" };
            case "editing":
                return { label: "Editing", className: "status-editing" };
            case "complete":
                return { label: "Complete", className: "status-complete" };
            default:
                return { label: "Draft", className: "status-draft" };
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const handleStatusFilter = (e) => {
        const value = e.target.value;
        setStatusFilter(value);
    };

    const handleSort = (e) => {
        const value = e.target.value;
        setSortBy(value);
    };

    const handleView = (e, draft) => {
        e.preventDefault();
        e.stopPropagation();

        setViewDraft(draft); //TODO: Handle draft view --> this is async so it won't render.
    };

    const handleEdit = (e, draft) => {
        e.preventDefault();
        console.log(draft);

        const toEdit = { ...draft };
        router.push("/book-editor");

        const numPages = toEdit.pages.length;

        for (let i = 0; i < numPages; i++) {
            setTimeout(() => {
                document.querySelector("#add-page-btn").click();

                let pagesElements = document.querySelector(`#page-${i + 1}`);
                pagesElements.querySelector(".page-content").textContent =
                    toEdit.pages[i].content;
            }, 500);
        }

        sessionStorage.setItem("draftContext", JSON.stringify(toEdit));
    };

    const handleDelete = (e, draft) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteConfirm(draft);
    };

    const confirmDelete = async () => {
        if (deleteConfirm) {
            // Find the project that contains this draft
            let parentProject = null;
            for (const book of books) {
                if (
                    Array.isArray(book.drafts) &&
                    book.drafts.some((d) => d.id === deleteConfirm.id)
                ) {
                    parentProject = book;
                    break;
                }
            }

            const res = await deleteDraft(parentProject, deleteConfirm.id);

            if (res.success) {
                setTimeout(() => {
                    setDrafts(
                        drafts.filter((draft) => draft.id !== deleteConfirm.id)
                    );
                    setDeleteConfirm(null);
                    setDeletingDraftId(null);
                }, FADE_DURATION);
            } else {
                console.error(res.message);
            }
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const handleCreateDraft = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowCreateModal(true);
    };

    const handleCreateConfirm = () => {

        const nDraft = new Draft();

        setDrafts([nDraft, ...drafts]);
        setShowCreateModal(false);
        setEditDraft({ ...nDraft });
        setTimeout(() => {
            setHighlightedDraftId(nDraft.id);
            newDraftRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            setTimeout(() => setHighlightedDraftId(null), 1000);
        }, 100);
    };

    const handleCreateCancel = () => {
        setShowCreateModal(false);
    };

    const handleEditSave = () => {
        //TODO: Check relevance since we redirect to the existing book editor.
        setDrafts((prev) =>
            prev.map((d) =>
                d.id === editDraft.id
                    ? {
                          ...editDraft,
                          lastModified: new Date(),
                          wordCount: editDraft.draftContent
                              .split(/\s+/)
                              .filter(Boolean).length,
                      }
                    : d
            )
        );
        setEditDraft(null);
    };

    const handleEditCancel = () => setEditDraft(null);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                setViewDraft(null);
                setEditDraft(null);
                setDeleteConfirm(null);
                setShowCreateModal(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <div className="draft-manager">
            <div className="dm-header">
                <div className="dm-header-content">
                    <div className="dm-header-text">
                        <h1 className="dm-title">Draft Manager</h1>
                        <p className="dm-subtitle">
                            Manage all your drafts across all books
                        </p>
                    </div>
                    <button
                        className="dm-create-btn"
                        onClick={handleCreateDraft}
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
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Draft
                    </button>
                </div>
            </div>

            <div className="dm-controls">
                <div className="dm-search-container">
                    <div className="dm-search-wrapper">
                        <svg
                            className="dm-search-icon"
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
                            placeholder="Search drafts by title, content, or book..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="dm-search-input"
                        />
                    </div>
                </div>

                <div className="dm-filters">
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className="dm-filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="editing">Editing</option>
                        <option value="complete">Complete</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={handleSort}
                        className="dm-filter-select"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                        <option value="word-count">Word Count</option>
                    </select>
                </div>
            </div>

            <div className="dm-results-info">
                {filteredAndSortedDrafts.length}{" "}
                {filteredAndSortedDrafts.length === 1 ? "draft" : "drafts"}{" "}
                found
            </div>

            <div className="dm-draft-list">
                {filteredAndSortedDrafts.length === 0 ? (
                    <div className="dm-empty-state">
                        <div className="dm-empty-icon">
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
                                <polyline points="10,9 9,9 8,9"></polyline>
                            </svg>
                        </div>
                        <h3 className="dm-empty-title">No drafts found</h3>
                        <p className="dm-empty-description">
                            {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your search or filters"
                                : "No drafts yet. Start writing!"}
                        </p>
                    </div>
                ) : (
                    filteredAndSortedDrafts.map((draft, index) => {
                        const statusConfig = getStatusConfig(draft.status);
                        const isDeleting = deletingDraftId === draft.id;
                        const isHighlighted = highlightedDraftId === draft.id;
                        return (
                            <div
                                key={index}
                                className={`dm-draft-card${
                                    isDeleting ? " fade-out" : ""
                                }${isHighlighted ? " highlight" : ""}`}
                                ref={isHighlighted ? newDraftRef : null}
                                tabIndex={0}
                                aria-label={`Draft: ${draft.title}`}
                                style={{
                                    transition: `opacity ${FADE_DURATION}ms, box-shadow 0.3s`,
                                    opacity: isDeleting ? 0 : 1,
                                    boxShadow: isHighlighted
                                        ? "0 0 0 3px var(--accent), 0 4px 12px rgba(59,130,246,0.15)"
                                        : undefined,
                                }}
                            >
                                <div className="dm-card-header">
                                    <h3 className="dm-draft-title">
                                        {draft.title}
                                    </h3>
                                    <span
                                        className={`dm-status-badge ${statusConfig.className}`}
                                    >
                                        {statusConfig.label}
                                    </span>
                                </div>
                                <p className="dm-draft-snippet">
                                    {draft.draftContent}
                                </p>
                                <div className="dm-card-meta">
                                    <span className="dm-book-tag">
                                        {draft.tag}
                                    </span>
                                    <div className="dm-meta-info">
                                        {/* <span className="dm-word-count">
                                            {draft.wordCount.toLocaleString()}{" "}
                                            words
                                        </span>  --> doesn't work as expected */}
                                        <span className="dm-date">
                                            {formatDate(draft.lastEdited)}
                                        </span>
                                    </div>
                                </div>
                                <div className="dm-card-actions">
                                    <button
                                        className="dm-action-btn dm-view-btn"
                                        onClick={(e) => handleView(e, draft)}
                                        type="button"
                                        aria-label={`View ${draft.title}`}
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
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                            ></circle>
                                        </svg>
                                        View
                                    </button>
                                    <button
                                        className="dm-action-btn dm-edit-btn"
                                        onClick={(e) => handleEdit(e, draft)}
                                        type="button"
                                        aria-label={`Edit ${draft.title}`}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        className="dm-action-btn dm-delete-btn"
                                        onClick={(e) => handleDelete(e, draft)}
                                        type="button"
                                        aria-label={`Delete ${draft.title}`}
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
                    })
                )}
            </div>

            {viewDraft && (
                <div
                    className="dm-modal-overlay"
                    onClick={() => setViewDraft(null)}
                >
                    <div
                        className="dm-modal"
                        style={{ animation: "fadeIn 0.3s" }}
                        onClick={(e) => e.stopPropagation()}
                        tabIndex={-1}
                        aria-modal="true"
                        role="dialog"
                    >
                        <div className="dm-modal-header">
                            <h3 className="dm-modal-title">
                                {viewDraft.title}
                            </h3>
                        </div>
                        <div
                            className="dm-modal-content"
                            style={{ maxHeight: 350, overflowY: "auto" }}
                        >
                            <p
                                style={{
                                    color: "var(--muted-foreground)",
                                    marginBottom: 12,
                                }}
                            >
                                {viewDraft.draftContent}
                            </p>
                            <div
                                style={{
                                    fontSize: "0.95rem",
                                    color: "var(--muted-foreground)",
                                }}
                            >
                                <div>
                                    <strong>Book:</strong> {viewDraft.bookName}
                                </div>
                                <div>
                                    <strong>Status:</strong>{" "}
                                    {getStatusConfig(viewDraft.status).label}
                                </div>
                                <div>
                                    <strong>Words:</strong>{" "}
                                    {viewDraft.wordCount.toLocaleString()}
                                </div>
                                <div>
                                    <strong>Last Modified:</strong>{" "}
                                    {formatDate(viewDraft.lastEdited)}
                                </div>
                            </div>
                        </div>
                        <div className="dm-modal-actions">
                            <button
                                className="dm-modal-btn dm-modal-cancel"
                                onClick={() => setViewDraft(null)}
                                type="button"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editDraft && (
                <div className="dm-modal-overlay" onClick={handleEditCancel}>
                    <div
                        className="dm-modal"
                        style={{ animation: "fadeIn 0.3s" }}
                        onClick={(e) => e.stopPropagation()}
                        tabIndex={-1}
                        aria-modal="true"
                        role="dialog"
                    >
                        <div className="dm-modal-header">
                            <h3 className="dm-modal-title">Edit Draft</h3>
                        </div>
                        <form
                            className="dm-modal-content"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleEditSave();
                            }}
                        >
                            <div
                                className="form-group"
                                style={{ marginBottom: 12 }}
                            >
                                <label
                                    htmlFor="edit-title"
                                    style={{
                                        fontWeight: 500,
                                        color: "var(--foreground)",
                                    }}
                                >
                                    Title
                                </label>
                                <input
                                    id="edit-title"
                                    className="dm-search-input"
                                    style={{ marginTop: 4 }}
                                    value={editDraft.title}
                                    onChange={(e) =>
                                        setEditDraft({
                                            ...editDraft,
                                            title: e.target.value,
                                        })
                                    }
                                    required
                                    maxLength={120}
                                    autoFocus
                                />
                            </div>
                            <div
                                className="form-group"
                                style={{ marginBottom: 12 }}
                            >
                                <label
                                    htmlFor="edit-snippet"
                                    style={{
                                        fontWeight: 500,
                                        color: "var(--foreground)",
                                    }}
                                >
                                    Content
                                </label>
                                <textarea
                                    id="edit-snippet"
                                    className="dm-search-input"
                                    style={{
                                        marginTop: 4,
                                        minHeight: 80,
                                        fontFamily: "inherit",
                                    }}
                                    value={editDraft.draftContent}
                                    onChange={(e) =>
                                        setEditDraft({
                                            ...editDraft,
                                            draftContent: e.target.value,
                                        })
                                    }
                                    required
                                    maxLength={2000}
                                />
                                <div
                                    style={{
                                        fontSize: "0.85rem",
                                        color: "var(--muted-foreground)",
                                        marginTop: 2,
                                    }}
                                >
                                    {editDraft.draftContent.length} characters
                                </div>
                            </div>
                            <div
                                className="form-group"
                                style={{ marginBottom: 12 }}
                            >
                                <label
                                    htmlFor="edit-book"
                                    style={{
                                        fontWeight: 500,
                                        color: "var(--foreground)",
                                    }}
                                >
                                    Book/Collection
                                </label>
                                <input
                                    id="edit-book"
                                    className="dm-search-input"
                                    style={{ marginTop: 4 }}
                                    value={editDraft.bookName}
                                    onChange={(e) =>
                                        setEditDraft({
                                            ...editDraft,
                                            bookName: e.target.value,
                                        })
                                    }
                                    required
                                    maxLength={60}
                                />
                            </div>
                            <div className="dm-modal-actions">
                                <button
                                    className="dm-modal-btn dm-modal-cancel"
                                    type="button"
                                    onClick={handleEditCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="dm-modal-btn dm-modal-create"
                                    type="submit"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="dm-modal-overlay" onClick={cancelDelete}>
                    <div
                        className="dm-modal"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: "fadeIn 0.3s" }}
                    >
                        <div className="dm-modal-header">
                            <h3 className="dm-modal-title">Confirm Delete</h3>
                        </div>
                        <div className="dm-modal-content">
                            <p>
                                Are you sure you want to delete{" "}
                                <strong>"{deleteConfirm.title}"</strong>?
                            </p>
                            <p className="dm-modal-warning">
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="dm-modal-actions">
                            <button
                                className="dm-modal-btn dm-modal-cancel"
                                onClick={cancelDelete}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="dm-modal-btn dm-modal-confirm"
                                onClick={confirmDelete}
                                type="button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="dm-modal-overlay" onClick={handleCreateCancel}>
                    <div
                        className="dm-modal"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: "fadeIn 0.3s" }}
                    >
                        <div className="dm-modal-header">
                            <h3 className="dm-modal-title">Create New Draft</h3>
                        </div>
                        <div className="dm-modal-content">
                            <p>Ready to start a new draft?</p>
                            <p className="dm-modal-warning">
                                You can edit the title and content after
                                creation.
                            </p>
                        </div>
                        <div className="dm-modal-actions">
                            <button
                                className="dm-modal-btn dm-modal-cancel"
                                onClick={handleCreateCancel}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="dm-modal-btn dm-modal-create"
                                onClick={handleCreateConfirm}
                                type="button"
                            >
                                Create Draft
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .fade-out {
                    opacity: 0 !important;
                    pointer-events: none;
                    transition: opacity ${FADE_DURATION}ms;
                }
                .highlight {
                    box-shadow: 0 0 0 3px var(--accent),
                        0 4px 12px rgba(59, 130, 246, 0.15) !important;
                    transition: box-shadow 0.3s;
                }
            `}</style>
        </div>
    );
};

export default DraftManager;
