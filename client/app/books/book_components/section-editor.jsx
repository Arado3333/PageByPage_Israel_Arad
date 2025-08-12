"use client";

import { useState, useEffect } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Textarea } from "../../books/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

export default function SectionEditor({ book, section, onBack, onSave }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [page, setPage] = useState(1);
    const [tag, setTag] = useState("");
    const [role, setRole] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [maxPages, setMaxPages] = useState(section.pages.length || null);

    useEffect(() => {
        if (section) {
            console.log(section);

            setTitle(section.title || section.name || "");
            setContent(
                section.pages?.[page - 1]?.content || section.notes || ""
            );
            setTag(section.tag || "");
            setRole(section.role || "");
            setType(section.type || "");
            setDescription(section.description || "");
        }
    }, [section, page]);

    useEffect(() => {
        setHasChanges(true);
    }, [title, content, tag, role, type, description]);

    function removeEmptyPages(pagesArr) {
        const removed = pagesArr.filter(
            (page) => page.title !== "" && page.content !== ""
        );
        // If all pages are empty, keep the first one (or create a default)
        return removed.length > 0
            ? removed
            : [pagesArr[0] || { title: "", content: "" }];
    }

    function extractChaptersFromDrafts(drafts) { //returns even existing chapters with new ids
        let chapterObjs = [];
        if (!Array.isArray(drafts)) return [];
        const chapters = drafts.filter((draft) => draft.tag === "chapter");

        chapters.forEach((chapter) => {
            const chapObj = {
                id: `chapter_${Date.now() * Math.floor(Math.random() * 20) + 1}`,
                draftId: chapter.id,
                title: chapter.title,
                pages: removeEmptyPages(chapter.pages) || chapter.pages,
            };

            chapterObjs.push(chapObj);
        });

        return chapterObjs;
    }

    const handleSave = () => {
        let updatedSection = {
            ...section,
            lastEdited: new Date().toISOString(),
        };

        // Update common fields
        updatedSection.tag = tag;

        // Update type-specific fields
        switch (section.type) {
            case "character":
                updatedSection.name = title;
                updatedSection.role = role;
                updatedSection.notes = content;
                break;
            case "asset":
                updatedSection.name = title;
                updatedSection.type = type; // Assuming 'type' state is for asset type
                updatedSection.description = description;
                break;
            case "draft":
                updatedSection.title = title;
                updatedSection.pages[page - 1].content = content;
                break;
            case "note":
                updatedSection.title = title;
                updatedSection.content = content;
                break;
            default:
                // Handle unknown section types or add default updates
                updatedSection.title = title;
                updatedSection.pages[page].content = content;
                break;
        }

        let updatedBook = { ...book };

        // Determine which array to update and perform the update
        const sectionTypeKey = section.type + "s"; // e.g., 'draft' -> 'drafts'

        if (updatedBook[sectionTypeKey]) {
            updatedBook[sectionTypeKey] = updatedBook[sectionTypeKey].map(
                (item) => (item.id === section.id ? updatedSection : item)
            );
        } else {
            console.error(
                `Unknown section type or array not found: ${section.type}`
            );
            // Optionally handle this error, maybe don't save or show a message
            return;
        }

        const chapters = extractChaptersFromDrafts(updatedBook.drafts) || [];
        updatedBook = { ...updatedBook, chapters: chapters };

        for (let i = 0; i < updatedBook.drafts.length; i++) {
            let currentDraft = updatedBook.drafts[i];
            currentDraft.pages = removeEmptyPages(currentDraft.pages);
        }

        console.log(updatedBook);
        
        onSave(updatedBook);
        setHasChanges(false);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            let updatedBook = { ...book };
            let chapters = extractChaptersFromDrafts(updatedBook.drafts);

            if (section.type === "draft") {
                updatedBook.drafts =
                    book.drafts?.filter((draft) => draft.id !== section.id) ||
                    [];

                updatedBook.chapters = chapters.filter(
                    (chapter) => chapter.draftId !== section.id
                );
            } else if (section.type === "note") {
                updatedBook.notes = book.notes?.filter(
                    (note) => note.id !== section.id
                );
            } else if (section.type === "character") {
                updatedBook.characters = book.characters?.filter(
                    (character) => character.id !== section.id
                );
            } else if (section.type === "asset") {
                updatedBook.assets = book.assets?.filter(
                    (asset) => asset.id !== section.id
                );
            }

            updatedBook.lastEdited = new Date().toISOString();
            onSave(updatedBook);
            onBack();
        }
    };

    const getTypeLabel = () => {
        switch (section.type) {
            case "draft":
                return "Draft";
            case "note":
                return "Note";
            case "character":
                return "Character";
            case "asset":
                return "Asset";
            default:
                return "Section";
        }
    };

    const tagOptions = {
        draft: ["scene", "dialogue", "action", "description", "chapter"],
        note: ["plot", "research", "theme", "idea", "structure"],
        character: ["protagonist", "antagonist", "supporting", "minor"],
        asset: ["image", "document", "audio", "video", "reference"],
    };

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
                            {section.id
                                ? `Edit ${getTypeLabel()}`
                                : `New ${getTypeLabel()}`}
                            : {section.title || section.name || ""}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge className="badge-muted">
                                {section.type}
                            </Badge>
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
                        Edit {getTypeLabel()}
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
                        <Input
                            id="page"
                            type="number"
                            value={page}
                            onChange={(e) => setPage(Number(e.target.value))}
                            placeholder="Enter page number"
                            className="input-field transition-all"
                            min={1}
                            max={maxPages}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium mb-2"
                        >
                            {section.type === "character" ||
                            section.type === "asset"
                                ? "Name"
                                : "Title"}
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={`Enter ${section.type} title`}
                            className="input-field transition-all"
                        />
                    </div>

                    {section.type === "character" && (
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium mb-2"
                            >
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 input-field"
                            >
                                <option value="">Select role</option>
                                {tagOptions.character.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {section.type === "asset" && (
                        <div>
                            <label
                                htmlFor="type"
                                className="block text-sm font-medium mb-2"
                            >
                                Asset Type
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-3 py-2 input-field"
                            >
                                <option value="">Select type</option>
                                {tagOptions.asset.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {section.type !== "character" &&
                        section.type !== "asset" && (
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
                                    {tagOptions[section.type]?.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                    {section.type === "asset" ? (
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium mb-2"
                            >
                                Description
                            </label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe this asset..."
                                rows={6}
                                className="resize-none input-field transition-all"
                            />
                        </div>
                    ) : (
                        <div>
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium mb-2"
                            >
                                {section.type === "character"
                                    ? "Notes"
                                    : "Content"}
                            </label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={`Write your ${section.type} content here...`}
                                rows={15}
                                className="resize-none input-field transition-all"
                                style={{ fontFamily: "Georgia, serif" }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {section.type !== "asset" && (
                <div className="mt-4 text-sm text-muted">
                    Word count:{" "}
                    {
                        content.split(/\s+/).filter((word) => word.length > 0)
                            .length
                    }
                </div>
            )}
        </div>
    );
}
