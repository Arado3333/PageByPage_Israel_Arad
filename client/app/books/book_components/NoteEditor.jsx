import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../../books/ui/input";
import { Textarea } from "../../books/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { ArrowLeft, Save, Trash2, Lightbulb } from "lucide-react";
import Note from "../../lib/models/note.model.js";

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
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm mb-4">
                  <Lightbulb className="w-4 h-4" />
                  Note Editor
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0F1A2E] mb-2">
                  {section.id ? `Edit Note` : `New Note`}:{" "}
                  {section.title || section.name || ""}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-2 py-1 text-xs">
                    Note
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
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-auto"
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </section>

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
              <label htmlFor="title" className="block text-sm font-medium mb-2">
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
              <label htmlFor="tag" className="block text-sm font-medium mb-2">
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
    </div>
  );
}
