"use client"

import { useState, useEffect } from "react"
import { Button } from "../../books/ui/button"
import { Input } from "../../books/ui/input"
import { Textarea } from "../../books/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card"
import { Badge } from "../../books/ui/badge"
import { ArrowLeft, Save, Trash2 } from "lucide-react"

export default function SectionEditor({ book, section, onBack, onSave }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tag, setTag] = useState("")
  const [role, setRole] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (section) {
      setTitle(section.title || section.name || "")
      setContent(section.content || section.notes || "")
      setTag(section.tag || "")
      setRole(section.role || "")
      setType(section.type || "")
      setDescription(section.description || "")
    }
  }, [section])

  useEffect(() => {
    setHasChanges(true)
  }, [title, content, tag, role, type, description])

  const handleSave = () => {
    const updatedBook = { ...book }
    const updatedSection = {
      ...section,
      title: title || section.name,
      content: content || section.notes,
      tag,
      role,
      type: type || section.type,
      description,
    }

    if (section.type === "draft") {
      updatedBook.drafts = book.drafts.map((draft) => (draft.id === section.id ? updatedSection : draft))
    } else if (section.type === "note") {
      updatedBook.notes = book.notes.map((note) => (note.id === section.id ? updatedSection : note))
    } else if (section.type === "character") {
      updatedSection.name = title
      updatedSection.notes = content
      updatedBook.characters = book.characters.map((character) =>
        character.id === section.id ? updatedSection : character,
      )
    } else if (section.type === "asset") {
      updatedSection.name = title
      updatedSection.description = description
      updatedBook.assets = book.assets.map((asset) => (asset.id === section.id ? updatedSection : asset))
    }

    updatedBook.lastEdited = new Date().toISOString()
    onSave(updatedBook)
    setHasChanges(false)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedBook = { ...book }

      if (section.type === "draft") {
        updatedBook.drafts = book.drafts.filter((draft) => draft.id !== section.id)
      } else if (section.type === "note") {
        updatedBook.notes = book.notes.filter((note) => note.id !== section.id)
      } else if (section.type === "character") {
        updatedBook.characters = book.characters.filter((character) => character.id !== section.id)
      } else if (section.type === "asset") {
        updatedBook.assets = book.assets.filter((asset) => asset.id !== section.id)
      }

      updatedBook.lastEdited = new Date().toISOString()
      onSave(updatedBook)
      onBack()
    }
  }

  const getTypeLabel = () => {
    switch (section.type) {
      case "draft":
        return "Draft"
      case "note":
        return "Note"
      case "character":
        return "Character"
      case "asset":
        return "Asset"
      default:
        return "Section"
    }
  }

  const tagOptions = {
    draft: ["scene", "dialogue", "action", "description", "chapter"],
    note: ["plot", "research", "theme", "idea", "structure"],
    character: ["protagonist", "antagonist", "supporting", "minor"],
    asset: ["image", "document", "audio", "video", "reference"],
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="transition-all hover:scale-105 p-2"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--muted-foreground)")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              {section.id ? `Edit ${getTypeLabel()}` : `New ${getTypeLabel()}`}: {section.title || section.name || ""}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="badge-muted">{section.type}</Badge>
              {hasChanges && <Badge className="badge-accent">Unsaved changes</Badge>}
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
        <CardHeader className="border-b mobile-p" style={{ borderColor: "var(--border)" }}>
          <CardTitle style={{ color: "var(--foreground)" }}>Edit {getTypeLabel()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6 mobile-p">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              {section.type === "character" || section.type === "asset" ? "Name" : "Title"}
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
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                Role
              </label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 input-field">
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
              <label htmlFor="type" className="block text-sm font-medium mb-2">
                Asset Type
              </label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 input-field">
                <option value="">Select type</option>
                {tagOptions.asset.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {section.type !== "character" && section.type !== "asset" && (
            <div>
              <label htmlFor="tag" className="block text-sm font-medium mb-2">
                Tag
              </label>
              <select value={tag} onChange={(e) => setTag(e.target.value)} className="w-full px-3 py-2 input-field">
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
              <label htmlFor="description" className="block text-sm font-medium mb-2">
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
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                {section.type === "character" ? "Notes" : "Content"}
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
          Word count: {content.split(/\s+/).filter((word) => word.length > 0).length}
        </div>
      )}
    </div>
  )
}
