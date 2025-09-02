"use client";

import { use, useEffect, useState } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import ConfirmDeletion from "./ConfirmDeletion";
import {
  Search,
  FolderOpen,
  Plus,
  Filter,
  BookOpen,
  Sparkles,
} from "lucide-react";
import {
  getTokenFromCookies,
  deleteProject,
  deleteBook,
} from "../../api/routes.js";
import { redirectTo } from "../../lib/actions.js";

export default function BookLibrary({
  booksPromise,
  onOpenBook,
  onNewProject,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [deleteMode, setDeleteMode] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState("");
  const [isExist, setIsExist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const books = use(booksPromise);

  const allTags = [...new Set(books.flatMap((book) => book.genres))];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTag = tagFilter === "All" || book.tags.includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  const getDraftCount = (book) => book.drafts?.length || 0;
  const getNotesCount = (book) => book.notes?.length || 0;

  function handleDeleteClick(e) {
    const buttonId = e.target.id;
    const parentElement = document.querySelector(`#c-${buttonId}`);
    const projectTitle = parentElement.querySelector(
      "#title-" + buttonId
    ).textContent;

    setProjectToDelete(projectTitle);
    setDeleteMode(true);
  }

  async function handleDeleteConfirm(projectName) {
    const token = await getTokenFromCookies();
    const bookToDelete = books.filter((book) => book.title === projectName);

    if (!bookToDelete.length) return;
    const projDeletionConfirm = await deleteProject(bookToDelete[0]._id, token);
    const delBookConfirm = await deleteBook(bookToDelete, token);

    if (projDeletionConfirm.success && delBookConfirm.success) {
      setBooks(books.filter((book) => book._id !== bookToDelete[0]._id));
    }
    redirectTo("/books");
  }

  function handleDeleteCancel() {
    setDeleteMode(false);
  }

  useEffect(() => {
    if (books.length > 0) {
      setIsExist(true);
    } else {
      setIsExist(false);
    }

    setIsLoading(false);
  }, [books]);

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

  const getBorderColor = (index) => {
    const colors = [
      "border-indigo-500",
      "border-pink-500",
      "border-emerald-500",
      "border-violet-500",
      "border-amber-500",
      "border-cyan-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen text-slate-800">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-30" />
      </div>

      <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16">
        {/* Hero Section */}
        <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg">
              <Sparkles className="w-4 h-4" />
              Your Library
            </div>
            <Button
              data-testid="cypress-new-project-btn"
              className="new-project-btn font-medium mobile-full bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => onNewProject()}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-serif text-[#0F1A2E] mb-2">
            Your Creative Projects
          </h1>
          <p className="text-base sm:text-lg 2xl:text-xl 3xl:text-2xl text-slate-600 mb-6">
            Explore and manage your writing projects
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="All">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {!isLoading && !isExist && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              Nothing to show. Create your first project!
            </p>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-12 3xl:gap-16">
          {filteredBooks.map((book, index) => (
            <div
              id={"c-" + index}
              key={index}
              className={`group rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col h-full overflow-hidden`}
            >
              {/* Gradient Header */}
              <div
                className={`h-2 bg-gradient-to-r ${getCardGradient(index)}`}
              />

              <div className="p-4 sm:p-6 2xl:p-8 3xl:p-10 flex-1 flex flex-col">
                {/* Title and Status */}
                <div className="flex justify-between items-start mb-4">
                  <h3
                    id={"title-" + index}
                    className="text-lg sm:text-xl lg:text-2xl font-serif text-[#0F1A2E] font-medium"
                  >
                    {book.title}
                  </h3>
                  <Badge className="bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-2 py-1 text-xs">
                    {book.status}
                  </Badge>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.genres.map((tag) => (
                    <Badge
                      className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2 py-1 text-xs"
                      key={tag}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="space-y-3 text-sm flex-1 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Drafts</span>
                    <span className="font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                      {getDraftCount(book)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Notes</span>
                    <span className="font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                      {getNotesCount(book)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Characters</span>
                    <span className="font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                      {book.characters?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Assets</span>
                    <span className="font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                      {book.assets?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => onOpenBook(book)}
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Open Workspace
                  </Button>
                  <Button
                    onClick={handleDeleteClick}
                    id={index}
                    className="w-full bg-red-400 hover:bg-red-500 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Delete Project
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {deleteMode && (
          <ConfirmDeletion
            toDelete={projectToDelete}
            onDeleteConfirm={() => {
              handleDeleteConfirm(projectToDelete);
              setDeleteMode(false);
            }}
            onDeleteCancel={handleDeleteCancel}
          />
        )}
      </div>
    </div>
  );
}
