"use client";
import "../style/Drafts.css";
import Draft from "../lib/models/draft.model.js";
import { useState, useMemo, use, useActionState } from "react";
import { getProjectsWithCookies, updateDataToServer } from "../api/routes";
import { updateProjectData } from "../lib/actions.js";

export default function Header() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [books, setBooks] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [editDraft, setEditDraft] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [highlightedDraftId, setHighlightedDraftId] = useState(null);

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

    const handleCreateDraft = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowCreateModal(true);
    };

    const handleCreateConfirm = async () => {
        const nDraft = new Draft();
        setDrafts([...drafts, nDraft]);
        setShowCreateModal(false);
        setEditDraft({ ...nDraft });
        setIsEditing(true);
        setTimeout(() => {
            setHighlightedDraftId(nDraft.id);
            setTimeout(() => setHighlightedDraftId(null), 1000);
        }, 100);

        const books = await getProjectsWithCookies();
        setBooks(books);
    };

    const [state, updateAction] = useActionState(updateProjectData, editDraft);

    const handleEditCancel = () => {
        setEditDraft(null);
        setIsEditing(false);
        setShowCreateModal(false);
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

    return (
        <div className="dm-header">
            <div className="dm-header-content">
                <div className="dm-header-text">
                    <h1 className="dm-title">Draft Manager</h1>
                    <p className="dm-subtitle pb-5">
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

            {showCreateModal && (
                <div
                    className="dm-modal-overlay"
                    onClick={() => setShowCreateModal(false)}
                >
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
                                onClick={() => setShowCreateModal(false)}
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

            {isEditing && editDraft && (
                <div
                    className="dm-modal-overlay"
                    onKeyDown={(e) => {
                        e.key === "Escape" && handleEditCancel();
                    }}
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
                            <h3 className="dm-modal-title">Edit Draft</h3>
                        </div>
                        <form
                            action={updateAction}
                            className="dm-modal-content"
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
                                    name="title"
                                    style={{ marginTop: 4 }}
                                    value={editDraft.title || ""}
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
                                    name="snippet"
                                    style={{
                                        marginTop: 4,
                                        minHeight: 80,
                                        fontFamily: "inherit",
                                    }}
                                    value={editDraft.draftContent || ""}
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
                                    {(editDraft.draftContent || "").length}{" "}
                                    characters
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
                                <select
                                    id="edit-book"
                                    className="dm-search-input"
                                    name="book"
                                    style={{ marginTop: 4 }}
                                    value={editDraft.bookName || ""}
                                    onChange={(e) =>
                                        setEditDraft({
                                            ...editDraft,
                                            bookName: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="" disabled>
                                        Select a book
                                    </option>
                                    {[
                                        ...new Set(
                                            books
                                                .map((d) => d.title)
                                                .filter(Boolean)
                                        ),
                                    ].map((name) => (
                                        <option
                                            id="selected-book"
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </option>
                                    ))}
                                </select>
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
        </div>
    );
}
