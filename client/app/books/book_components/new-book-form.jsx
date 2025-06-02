"use client"

import { useState } from "react"
import { Button } from "../../books/ui/button"
import { Input } from "../../books/ui/input"
import { Textarea } from "../../books/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card"
import { ArrowLeft } from "lucide-react"

export default function NewBookForm({ onCreateBook, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    description: "",
    content: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const bookData = {
      title: formData.title.trim(),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      description: formData.description.trim(),
      content: formData.content.trim(),
    }

    onCreateBook(bookData)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create New Book</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter your book title"
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2">
                Tags
              </label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="Fiction, Memoir, Sci-fi (comma separated)"
              />
              <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of your book"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Start Writing</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Begin writing your book here..."
              rows={12}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!formData.title.trim()}>
            Create Book
          </Button>
        </div>
      </form>
    </div>
  )
}
