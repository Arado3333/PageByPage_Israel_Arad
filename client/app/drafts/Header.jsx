"use client";
import "../style/Drafts.css";
import Draft from "../lib/models/draft.model.js";
import { useState, useMemo, use, useActionState } from "react";
import { getProjectsWithCookies, updateDataToServer } from "../api/routes";
import { updateProjectData } from "../lib/actions.js";
import StateButton from "../../components/StateButton";
import SubmitButton from "../signin/SubmitButton";
import { Plus, Search, Filter, Sparkles } from "lucide-react";

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
        draft.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-30" />
      </div>

      <div className="dm-header-content">
        {/* Hero Section */}
        <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg">
              <Sparkles className="w-4 h-4" />
              Draft Manager
            </div>
            <button
              className="dm-create-btn bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              onClick={handleCreateDraft}
              type="button"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Draft
            </button>
          </div>

          <h1 className="dm-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-serif text-[#0F1A2E] mb-2">
            Your Creative Drafts
          </h1>
          <p className="dm-subtitle text-base sm:text-lg 2xl:text-xl 3xl:text-2xl text-slate-600 mb-6">
            Manage all your drafts across all books
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search drafts by title, content, or book..."
                value={searchTerm}
                onChange={handleSearch}
                className="dm-search-input pl-10 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="dm-filter-select px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="editing">Editing</option>
                <option value="complete">Complete</option>
              </select>

              <select
                value={sortBy}
                onChange={handleSort}
                className="dm-filter-select px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
                <option value="word-count">Word Count</option>
              </select>
            </div>
          </div>
        </section>
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
                You can edit the title and content after creation.
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
            <form action={updateAction} className="dm-modal-content">
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
                  {(editDraft.draftContent || "").length} characters
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
                  {[...new Set(books.map((d) => d.title).filter(Boolean))].map(
                    (name) => (
                      <option id="selected-book" key={name} value={name}>
                        {name}
                      </option>
                    )
                  )}
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

                <SubmitButton
                  className="dm-modal-btn dm-modal-create disabled:opacity-50"
                  text={"Save"}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
