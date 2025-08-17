"use client";
import { useState, useMemo, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Draft from "../lib/models/draft.model.js";
import { deleteDraft } from "../api/routes.js";

const FADE_DURATION = 350; // ms

function getStatusConfig(status) {
    switch (status) {
        case "draft":
            return { label: "Draft", className: "status-draft" };
        case "in-review":
            return { label: "In Review", className: "status-review" };
        case "published":
            return { label: "Published", className: "status-published" };
        default:
            return { label: "Draft", className: "status-draft" };
    }
}

function formatDate(date) {
    if (!date) return "";
    let d = new Date(date);
    return d.toDateString();
}

export default function DraftsContent({ draftsPromise, booksPromise }) {
    const router = useRouter();
    const drafts = use(draftsPromise);
    const books = use(booksPromise);

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
    const handleEditCancel = () => setEditDraft(null);

    const filteredAndSortedDrafts = useMemo(() => {
        const filtered = drafts.filter((draft) => {
            const matchesSearch =
                draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (draft.snippet &&
                    draft.snippet
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (draft.bookName &&
                    draft.bookName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));

            const matchesStatus =
                statusFilter === "all" || draft.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return (
                        new Date(b.lastModified || b.lastEdited) -
                        new Date(a.lastModified || a.lastEdited)
                    );
                case "oldest":
                    return (
                        new Date(a.lastModified || a.lastEdited) -
                        new Date(b.lastModified || b.lastEdited)
                    );
                case "a-z":
                    return a.title.localeCompare(b.title);
                case "z-a":
                    return b.title.localeCompare(a.title);
                case "word-count":
                    return (b.wordCount || 0) - (a.wordCount || 0);
                default:
                    return 0;
            }
        });

        console.log(filtered);
        return filtered;
    }, [drafts, searchTerm, statusFilter, sortBy]);

    const handleSort = (e) => {
        setSortBy(e.target.value);
    };

    const handleView = (e, draft) => {
        e.preventDefault();
        e.stopPropagation();
        setViewDraft(draft);
    };

    const handleEdit = (e, draft) => {
        e.preventDefault();
        const toEdit = { ...draft };
        router.push("/book-editor-v2");

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
            setDeletingDraftId(deleteConfirm.id);

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
                setDeleteConfirm(null);
                setDeletingDraftId(null);
            } else {
                console.error(res.message);
            }
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const handleCreateConfirm = () => {
        const nDraft = new Draft();
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
        setEditDraft(null);
    };

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
            <div className="dm-draft-list">
                {filteredAndSortedDrafts.length === 0 ? (
                    <div className="dm-empty-state">
                        <div className="dm-empty-icon">
                            {/* SVG icon here if needed */}
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
                                        View
                                    </button>
                                    <button
                                        className="dm-action-btn dm-edit-btn"
                                        onClick={(e) => handleEdit(e, draft)}
                                        type="button"
                                        aria-label={`Edit ${draft.title}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="dm-action-btn dm-delete-btn"
                                        onClick={(e) => handleDelete(e, draft)}
                                        type="button"
                                        aria-label={`Delete ${draft.title}`}
                                    >
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
        </div>
    );
}
