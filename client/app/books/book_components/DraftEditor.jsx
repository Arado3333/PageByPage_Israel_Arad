"use client";

import { useState, useEffect } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Textarea } from "../../books/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { ArrowLeft, Save, Trash2, Plus, FileText } from "lucide-react";
import Draft from "../../lib/models/draft.model.js";
import { logBookEvent } from "../../lib/logManager";

export default function DraftEditor({ book, section, onBack, onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [page, setPage] = useState(1);
  const [tag, setTag] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [maxPages, setMaxPages] = useState(section.pages.length || 0);
  const [pages, setPages] = useState(section.pages ? [...section.pages] : []);

  let wordCount = content
    ?.split(/\s+/)
    .filter((word) => word.length > 0).length;

  useEffect(() => {
    if (section) {
      setTitle(section.title || section.name || "");
      setTag(section.tag || "");
      setPages(section.pages ? [...section.pages] : []);
    }
  }, [section]);

  useEffect(() => {
    if (pages[page - 1]) {
      setContent(pages[page - 1].content || "");
    } else {
      setContent("");
    }
    setMaxPages(pages.length);
  }, [page, pages]);

  useEffect(() => {
    setHasChanges(true);
  }, [title, content, tag]);

  const handleSave = () => {
    // Ensure the current content is saved to the correct page before saving all pages
    const updatedPages = pages.map((p, idx) =>
      idx === page - 1 ? { ...p, content } : p
    );

    // Build a new draft object from the current state
    let draftObj = new Draft(
      title,
      updatedPages,
      updatedPages.map((p) => p.content).join("\n\n"),
      tag,
      wordCount
    );

    //If the tag is chapter --> create new chapter and add it to the updatedBook
    function createChapter(draft) {
      let chap = null;

      if (draft.tag == "chapter") {
        chap = {
          id: `chapter_${Date.now()}`,
          draftId: draft.id,
          title: draft.title,
          pages: draft.pages,
        };
      }
      return chap;
    }

    const chapter = createChapter(draftObj);

    // Create a new drafts array
    let newDrafts = Array.isArray(book.drafts) ? [...book.drafts] : [];

    const existingIdx = newDrafts.findIndex((item) =>
      console.log(item.id + " " + draftObj.id)
    );

    if (existingIdx !== -1) {
      // Update existing draft
      newDrafts[existingIdx] = { ...draftObj };
    } else {
      // Add new draft
      newDrafts.push({ ...draftObj });
    }

    // Create a new updatedBook object
    let updatedBook = {
      ...book,
      drafts: newDrafts,
    };

    if (chapter && !updatedBook.chapters) {
      updatedBook = { ...updatedBook, chapters: [chapter] };
    }

    if (chapter && updatedBook.chapters) {
      updatedBook = {
        ...updatedBook,
        chapters: [...updatedBook.chapters, chapter],
      };
    }

    console.log(updatedBook);

    // Log chapter creation if a new chapter was created
    if (chapter) {
      logBookEvent(
        "Chapter created",
        null, // Auto-detect user ID
        null, // Auto-detect user email
        {
          action: "create_chapter",
          bookTitle: book.title,
          bookId: book._id,
          chapterTitle: chapter.title,
          chapterId: chapter.id,
          timestamp: new Date().toISOString(),
        }
      );
    }

    onSave(updatedBook);
    setHasChanges(false);
  };

  const handleAddPage = () => {
    //UI Update
    setPages((prev) => [...prev, { title: title, content: "" }]);
    setPage(pages.length + 1);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedBook = { ...book };
      updatedBook.drafts = book.drafts.filter(
        (draft) => draft.id !== section.id
      );
      updatedBook.lastEdited = new Date().toISOString();
      onSave(updatedBook);
      onBack();
    }
  };

  const tagOptions = ["scene", "dialogue", "action", "description", "chapter"];

  return (
    <div className="min-h-screen text-slate-800">
      {/* Decorative blobs - matching library page */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Hero Section */}
        <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 mb-6 w-full">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
              <Button
                variant="ghost"
                onClick={onBack}
                className="transition-all hover:scale-105 p-2 rounded-xl hover:bg-slate-100"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "var(--muted-foreground)")
                }
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 text-sm mb-4">
                  <FileText className="w-4 h-4" />
                  Draft Editor
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0F1A2E] mb-2">
                  {section.id ? `Edit Draft` : `New Draft `}:{" "}
                  {section.title || section.name || ""}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-2 py-1 text-xs">
                    draft
                  </Badge>
                  {hasChanges && (
                    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-1 text-xs">
                      Unsaved changes
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              <Button
                onClick={handleDelete}
                className="w-full sm:w-auto px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md flex-1 sm:flex-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                onClick={handleSave}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-auto"
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </section>

        <Card className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 overflow-hidden">
          {/* Gradient Header */}
          <div className="h-2 bg-gradient-to-r from-indigo-300 to-violet-500" />
          <CardHeader className="border-b border-slate-200 p-6">
            <CardTitle className="text-xl font-serif text-[#0F1A2E]">
              Edit Draft
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <label
                htmlFor="page"
                className="block text-sm font-medium mb-3 text-slate-700"
              >
                Page no.
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="page"
                  type="number"
                  value={page}
                  onChange={(e) => setPage(Number(e.target.value))}
                  placeholder="Enter page number"
                  className="w-24 p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  min={1}
                  max={maxPages}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="p-4 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={handleAddPage}
                  title="Add new page"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-3 text-slate-700"
              >
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter draft title"
                className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="tag"
                className="block text-sm font-medium mb-3 text-slate-700"
              >
                Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="">Select tag</option>
                {tagOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-3 text-slate-700"
              >
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => {
                  const newContent = e.target.value;
                  setContent(newContent);
                  setPages((prevPages) =>
                    prevPages.map((p, idx) =>
                      idx === page - 1
                        ? {
                            ...p,
                            id: idx,
                            content: newContent,
                          }
                        : p
                    )
                  );
                }}
                placeholder="Write your draft content here..."
                rows={15}
                className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                style={{ fontFamily: "Georgia, serif" }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-sm text-slate-500">
          Word count: {wordCount}
        </div>
      </div>
    </div>
  );
}
