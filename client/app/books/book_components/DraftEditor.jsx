"use client";

import { useState, useEffect, useRef } from "react";
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

    // Ref to hold the Draft object
    const draftRef = useRef(null);

    // Initialize Draft object on mount
    useEffect(() => {
        draftRef.current = new Draft({
            pages: [...pages],
        });
    }, []);

    // Update Draft object whenever pages or wordCount changes
    useEffect(() => {
        if (draftRef.current) {
            draftRef.current.pages = [...pages];
        }
    }, [pages, wordCount]);

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

        // Update the draftRef.current with the latest content and title
        draftRef.current.pages = updatedPages;
        draftRef.current.title = title;
        draftRef.current.draftContent = updatedPages
            .map((p) => p.content)
            .join("\n\n");
        draftRef.current.tag = tag;

        section = draftRef;

        let updatedBook = { ...book };

        if (updatedBook.drafts) {
            if (!draftRef.current.id) {
                updatedBook.drafts = [
                    ...updatedBook.drafts,
                    { ...draftRef.current },
                ];
            } else {
                updatedBook.drafts = updatedBook.drafts.map((item) =>
                    item.id === draftRef.current.id
                        ? { ...draftRef.current }
                        : item
                );
            }
        } else {
            console.error("Drafts array not found in book");
            return;
        }

        onSave(updatedBook);
        setHasChanges(false);
    };

    const handleAddPage = () => {
        draftRef.current.addPage(); //Draft object update

        //UI Update
        setPages((prev) => [...prev, { content: "" }]);
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
