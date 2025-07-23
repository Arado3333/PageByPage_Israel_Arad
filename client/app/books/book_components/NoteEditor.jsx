import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../../books/ui/input";
import { Textarea } from "../../books/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Note from "../../../lib/models/note.model.js";

export default function NoteEditor({
    book,
    section,
    onDelete,
    onSave,
    onBack,
}) {
    const [title, setTitle] = useState(section.title || "");
    const [tag, setTag] = useState(section.tag || "");
    const [content, setContent] = useState(section.content || "");
    const [hasChanges, setHasChanges] = useState(false);

    const tagOptions = {
        note: ["plot", "research", "theme", "idea", "structure"],
    };

    useEffect(() => {
        setHasChanges(
            title !== (section.title || "") ||
                tag !== (section.tag || "") ||
                content !== (section.content || "")
        );
    }, [title, tag, content, section]);

    const handleSave = () => {
        // Only handle "note" type
        if (section.type !== "note") return;

        const updatedSection = new Note(title, content, tag);
        updatedSection.lastEdited = new Date().toISOString();

        const updatedBook = {
            ...book,
            notes: book.notes.map((note) =>
                note.id === section.id ? updatedSection : note
            ),
            lastEdited: new Date().toISOString(),
        };

        onSave(updatedBook);
        setHasChanges(false);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            const updatedBook = {
                ...book,
                notes: book.notes.filter((note) => note.id !== section.id),
                lastEdited: new Date().toISOString(),
            };
            onSave(updatedBook);
            onBack();
        }
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
                            {section.id ? `Edit Note` : `New Note`}:{" "}
                            {section.title || section.name || ""}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge className="badge-muted">Note</Badge>
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
                        Edit Note
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 mobile-p">
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
                            placeholder={`Enter note title`}
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
                            {tagOptions.note.map((option) => (
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
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`Write your note content here...`}
                            rows={15}
                            className="resize-none input-field transition-all"
                            style={{ fontFamily: "Georgia, serif" }}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="mt-4 text-sm text-muted">
                Word count:{" "}
                {content.split(/\s+/).filter((word) => word.length > 0).length}
            </div>
        </div>
    );
}
