"use client"

import { useState } from "react"
import { Button } from "../../books/ui/button"
import { Input } from "../../books/ui/input"
import { Textarea } from "../../books/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card"
import { ArrowLeft, Plus } from "lucide-react"

export default function NewProjectForm({ onCreateProject, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    tags: [],
    description: "",
    status: "Draft"
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const projectData = {
      title: formData.title.trim(),
      author: formData.author,
      genres: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      description: formData.description.trim(),
      status: formData.status
    }
    

    onCreateProject(projectData)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="transition-all hover:scale-105 p-2"
          style={{ color: "var(--muted-foreground)" }}
          onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
          onMouseLeave={(e) => (e.target.style.color = "var(--muted-foreground)")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            Create New Project
          </h1>
          <p className="text-muted">Start your next writing adventure</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="card">
          <CardHeader className="border-b mobile-p" style={{ borderColor: "var(--border)" }}>
            <CardTitle style={{ color: "var(--foreground)" }}>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 mobile-p">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Project Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter your project title"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Author *
              </label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="Who's writing the book?"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Tags
              </label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="Fiction, Memoir, Sci-fi (comma separated)"
                className="input-field"
              />
              <p className="text-xs text-muted mt-1">Separate tags with commas</p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
                Status *
              </label>
              <select
                id="status"
                value={formData.status || "Draft"}
                onChange={(e) => handleChange("status", e.target.value)}
                className="input-field block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 "
                required
              >
                <option value="Draft">Draft</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of your project"
                rows={4}
                className="input-field resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button type="button" className="btn-outline w-full sm:w-auto" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="btn-primary w-full sm:w-auto" disabled={!formData.title.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>
      </form>
    </div>
  )
}
