"use client";
import { useState, useMemo, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Draft from "../lib/models/draft.model.js";
import { deleteDraft, getRecentDrafts_noSlice } from "../api/routes.js";
import { Eye, Edit, Trash2, BookOpen, Calendar, FileText } from "lucide-react";

const FADE_DURATION = 350; // ms

function getStatusConfig(status) {
  switch (status) {
    case "draft":
      return {
        label: "Draft",
        className: "status-draft",
        color: "bg-slate-100 text-slate-700 border-slate-200",
      };
    case "in-review":
      return {
        label: "In Review",
        className: "status-review",
        color: "bg-amber-100 text-amber-700 border-amber-200",
      };
    case "published":
      return {
        label: "Published",
        className: "status-published",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      };
    default:
      return {
        label: "Draft",
        className: "status-draft",
        color: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
}

function formatDate(date) {
  if (!date) return "";
  let d = new Date(date);
  return d.toDateString();
}

export default function DraftsContent({ draftsPromise, booksPromise }) {
  const router = useRouter();
  const initialDrafts = use(draftsPromise);
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
  const [drafts, setDrafts] = useState(initialDrafts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animatingOutDraftId, setAnimatingOutDraftId] = useState(null);
  const newDraftRef = useRef(null);
  const handleEditCancel = () => setEditDraft(null);

  // Update drafts when initialDrafts changes
  useEffect(() => {
    setDrafts(initialDrafts);
  }, [initialDrafts]);

  // Function to refresh drafts data
  const refreshDrafts = async () => {
    setIsRefreshing(true);
    try {
      const freshDrafts = await getRecentDrafts_noSlice();
      setDrafts(freshDrafts);
    } catch (error) {
      console.error("Error refreshing drafts:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredAndSortedDrafts = useMemo(() => {
    const filtered = drafts.filter((draft) => {
      const matchesSearch =
        draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (draft.pages[0] &&
          draft.pages[0].content
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (draft.bookName &&
          draft.bookName.toLowerCase().includes(searchTerm.toLowerCase()));

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
    //Injects the draft content into the editor
    e.preventDefault();
    const toEdit = { ...draft };
    // Store the draft context for the editor to load
    sessionStorage.setItem("draftContext", JSON.stringify(toEdit));
    console.log(toEdit);
    router.push("/book-editor-v2");
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

      try {
        const res = await deleteDraft(parentProject, deleteConfirm.id);

        if (res.success) {
          // Start the fade-out animation
          setAnimatingOutDraftId(deleteConfirm.id);

          // Wait for animation to complete, then remove from state
          setTimeout(() => {
            setDrafts((prevDrafts) =>
              prevDrafts.filter((draft) => draft.id !== deleteConfirm.id)
            );
            setAnimatingOutDraftId(null);
          }, FADE_DURATION);

          // Also refresh from server to ensure consistency
          setTimeout(() => {
            refreshDrafts();
          }, FADE_DURATION + 100);

          setDeleteConfirm(null);
          setDeletingDraftId(null);
        } else {
          console.error("Delete failed:", res.message);
          setDeletingDraftId(null);
        }
      } catch (error) {
        console.error("Error deleting draft:", error);
        setDeletingDraftId(null);
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
    // Refresh drafts after editing
    refreshDrafts();
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

  const getCardGradient = (index) => {
    const gradients = [
      "from-indigo-300 to-indigo-500",
      "from-pink-300 to-rose-500",
      "from-emerald-300 to-teal-500",
      "from-violet-300 to-purple-500",
      "from-amber-300 to-orange-500",
      "from-cyan-300 to-blue-500",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="draft-manager">
      <div className="dm-draft-list">
        {filteredAndSortedDrafts.length === 0 ? (
          <div className="dm-empty-state">
            <div className="dm-empty-icon">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            </div>
            <h3 className="dm-empty-title">No drafts found</h3>
            <p className="dm-empty-description">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No drafts yet. Start writing!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
            {filteredAndSortedDrafts.map((draft, index) => {
              const statusConfig = getStatusConfig(draft.status);
              const isDeleting = deletingDraftId === draft.id;
              const isAnimatingOut = animatingOutDraftId === draft.id;
              const isHighlighted = highlightedDraftId === draft.id;
              return (
                <div
                  key={draft.id || index}
                  className={`group rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col h-full overflow-hidden ${
                    isAnimatingOut ? "fade-out" : ""
                  } ${isHighlighted ? "highlight" : ""}`}
                  ref={isHighlighted ? newDraftRef : null}
                  tabIndex={0}
                  aria-label={`Draft: ${draft.title}`}
                  style={{
                    transition: `opacity ${FADE_DURATION}ms, box-shadow 0.3s`,
                    opacity: isAnimatingOut ? 0 : 1,
                    boxShadow: isHighlighted
                      ? "0 0 0 3px var(--accent), 0 4px 12px rgba(59,130,246,0.15)"
                      : undefined,
                  }}
                >
                  {/* Gradient Header */}
                  <div
                    className={`h-2 bg-gradient-to-r ${getCardGradient(index)}`}
                  />

                  <div className="p-4 sm:p-6 2xl:p-8 3xl:p-10 flex-1 flex flex-col">
                    {/* Title and Status */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="dm-draft-title text-lg sm:text-xl lg:text-2xl font-serif text-[#0F1A2E] font-medium">
                        {draft.title}
                      </h3>
                      <span
                        className={`dm-status-badge ${statusConfig.color} border rounded-full px-2 py-1 text-xs font-medium`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Content Snippet */}
                    <p className="dm-draft-snippet text-slate-600 line-height-1.6 mb-6">
                      {draft.draftContent}
                    </p>

                    {/* Meta Information */}
                    <div className="space-y-3 text-sm flex-1 mb-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <BookOpen className="w-4 h-4" />
                        <span className="dm-book-tag bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-lg text-xs font-medium">
                          {draft.bookName || "Unassigned"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                          {draft.wordCount?.toLocaleString() || 0} words
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                          {formatDate(draft.lastEdited)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        className="dm-action-btn dm-view-btn w-full bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        onClick={(e) => handleView(e, draft)}
                        type="button"
                        aria-label={`View ${draft.title}`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </button>
                      <button
                        className="dm-action-btn dm-edit-btn w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        onClick={(e) => handleEdit(e, draft)}
                        type="button"
                        aria-label={`Edit ${draft.title}`}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        className="dm-action-btn dm-delete-btn w-full bg-red-500 hover:bg-red-600 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        onClick={(e) => handleDelete(e, draft)}
                        type="button"
                        aria-label={`Delete ${draft.title}`}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {viewDraft && (
        <div className="dm-modal-overlay" onClick={() => setViewDraft(null)}>
          <div
            className="dm-modal"
            style={{ animation: "fadeIn 0.3s" }}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <div className="dm-modal-header">
              <h3 className="dm-modal-title">{viewDraft.title}</h3>
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
                  <strong>Words:</strong> {viewDraft.wordCount.toLocaleString()}
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
              <div className="form-group" style={{ marginBottom: 12 }}>
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
              <div className="form-group" style={{ marginBottom: 12 }}>
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
              <div className="form-group" style={{ marginBottom: 12 }}>
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
                <button className="dm-modal-btn dm-modal-create" type="submit">
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
              <p className="dm-modal-warning">This action cannot be undone.</p>
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
                disabled={deletingDraftId === deleteConfirm.id}
              >
                {deletingDraftId === deleteConfirm.id
                  ? "Deleting..."
                  : "Delete"}
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
                You can edit the title and content after creation.
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
