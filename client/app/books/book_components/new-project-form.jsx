"use client";

import { useState } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Textarea } from "../../books/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { ArrowLeft, Plus } from "lucide-react";

export default function NewProjectForm({ onCreateProject, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    tags: "",
    description: "",
    status: "Draft",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const projectData = {
      title: formData.title.trim(),
      author: formData.author,
      genres: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      description: formData.description?.trim(),
      status: formData.status,
    };

    onCreateProject(projectData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button
              variant="ghost"
              onClick={onCancel}
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
                <Plus className="w-4 h-4" />
                New Project
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0F1A2E] mb-2">
                Create New Project
              </h1>
              <p className="text-base sm:text-lg text-slate-600">
                Start your next writing adventure
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 overflow-hidden">
            {/* Gradient Header */}
            <div className="h-2 bg-gradient-to-r from-indigo-300 to-violet-500" />
            <CardHeader className="border-b border-slate-200 p-6">
              <CardTitle className="text-xl font-serif text-[#0F1A2E]">
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-3 text-slate-700"
                >
                  Project Title *
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter your project title"
                  className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium mb-3 text-slate-700"
                >
                  Author *
                </label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="Who's writing the book?"
                  className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium mb-3 text-slate-700"
                >
                  Tags
                </label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  placeholder="Fiction, Memoir, Sci-fi (comma separated)"
                  className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Separate tags with commas
                </p>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-3 text-slate-700"
                >
                  Status *
                </label>
                <select
                  id="status"
                  value={formData.status || "Draft"}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                >
                  <option value="Draft">Draft</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-3 text-slate-700"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Brief description of your project"
                  rows={4}
                  className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
            <Button
              type="button"
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.title.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
