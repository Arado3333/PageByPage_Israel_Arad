"use client"

import { useState, useEffect } from "react"
import { Button } from "../../books/ui/button"
import { Input } from "../../books/ui/input"
import { Textarea } from "../../books/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card"
import { ArrowLeft, Save, BookOpen, Target } from "lucide-react"

export default function BookEditor({ book, section, onBack, onSave }) {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (section) {
      if (section.type === "chapter" && section.content) {
        setTitle(section.content.title || "")
        setContent(section.content.content || "")
      } else if (section.type === "notes") {
        setContent(section.content || "")
      }
    }
  }, [section])

  useEffect(() => {
    setHasChanges(true);
  }, [content, title])

  const handleSave = () => {
    const updatedBook = { ...book }

    if (section.type === "chapter" && section.content) {
      updatedBook.chapters = book.chapters.map((chapter) =>
        chapter.id === section.content.id
          ? { ...chapter, title, content, wordCount: content.split(/\s+/).filter((word) => word.length > 0).length }
          : chapter,
      )
    } else if (section.type === "notes") {
      updatedBook.notes = content
    }

    updatedBook.lastEdited = new Date().toISOString()
    updatedBook.wordCount = updatedBook.chapters.reduce((total, chapter) => total + (chapter.wordCount || 0), 0)

    onSave(updatedBook)
    setHasChanges(false)
  }

  const handleBack = () => { 
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Do you want to save before leaving?")) {
        handleSave()
      }
    }
    onBack()
  }

  const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="p-3 hover:bg-primary/10 hover:text-primary transition-all rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {section?.type === "chapter" ? "Edit Chapter" : "Edit Notes"}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {book.title}
                </span>
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {wordCount.toLocaleString()} words
                </span>
                {hasChanges && <span className="text-yellow-600 font-medium">• Unsaved changes</span>}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-primary hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle className="text-xl">
              {section?.type === "chapter" ? "Chapter Content" : "Notes & Ideas"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {section?.type === "chapter" && (
              <div>
                <label htmlFor="title" className="block text-sm font-semibold mb-3 text-foreground">
                  Chapter Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter chapter title"
                  className="text-lg font-medium border-2 focus:border-primary transition-colors h-12"
                />
              </div>
            )}

            <div>
              <label htmlFor="content" className="block text-sm font-semibold mb-3 text-foreground">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  section?.type === "chapter"
                    ? "Write your chapter content here..."
                    : "Add your notes and ideas here..."
                }
                className="min-h-[600px] resize-none text-base leading-relaxed border-2 focus:border-primary transition-colors"
                style={{ fontFamily: "Georgia, serif" }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between items-center p-6 bg-muted/30 rounded-xl border">
          <div className="flex gap-8 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span className="font-medium">Words: {wordCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Characters: {content.length.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span className="font-medium">Pages (est.): {Math.ceil(wordCount / 250)}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground font-medium">Auto-save enabled</div>
        </div>
      </div>
    </div>
  )
}
