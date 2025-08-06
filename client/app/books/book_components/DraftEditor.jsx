"use client";

import { useState, useEffect } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Textarea } from "../../books/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";
import Draft from "../../lib/models/draft.model.js";

export default function DraftEditor({ book, section, onBack, onSave }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [page, setPage] = useState(1);
    const [tag, setTag] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [maxPages, setMaxPages] = useState(section.pages.length || null);
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

    const tagOptions = [
        "scene",
        "dialogue",
        "action",
        "description",
        "chapter",
    ];

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="transition-all hover:scale-105 p-2"
                        style={{ color: "var(--muted-foreground)" }}
                        onMouseEnter={(e) =>
                            (e.target.style.color = "var(--accent)")
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.color = "var(--muted-foreground)")
                        }
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1
                            className="text-2xl font-bold"
                            style={{ color: "var(--foreground)" }}
                        >
                            {section.id ? `Edit Draft` : `New Draft `}:{" "}
                            {section.title || section.name || ""}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge className="badge-muted">draft</Badge>
                            {hasChanges && (
                                <Badge className="badge-accent">
                                    Unsaved changes
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <Button
                        onClick={handleDelete}
                        className="btn-outline error transition-all hover:scale-105 flex-1 sm:flex-auto"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="btn-primary transition-all hover:scale-105 flex-1 sm:flex-auto"
                        disabled={!hasChanges}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                </div>
            </div>

            <Card className="card">
                <CardHeader
                    className="border-b mobile-p"
                    style={{ borderColor: "var(--border)" }}
                >
                    <CardTitle style={{ color: "var(--foreground)" }}>
                        Edit Draft
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 mobile-p">
                    <div>
                        <label
                            htmlFor="page"
                            className="block text-sm font-medium mb-2"
                        >
                            Page no.
                        </label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="page"
                                type="number"
                                value={page}
                                onChange={(e) =>
                                    setPage(Number(e.target.value))
                                }
                                placeholder="Enter page number"
                                className="input-field transition-all"
                                min={1}
                                max={maxPages}
                                style={{ width: 100 }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="p-2"
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
                            className="block text-sm font-medium mb-2"
                        >
                            Title
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter draft title"
                            className="input-field transition-all"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="tag"
                            className="block text-sm font-medium mb-2"
                        >
                            Tag
                        </label>
                        <select
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="w-full px-3 py-2 input-field"
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
                            className="block text-sm font-medium mb-2"
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
                            className="resize-none input-field transition-all"
                            style={{ fontFamily: "Georgia, serif" }}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="mt-4 text-sm text-muted">
                Word count: {wordCount}
            </div>
        </div>
    );
}
