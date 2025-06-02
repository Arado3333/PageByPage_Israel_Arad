"use client"

import { useState } from "react"
import { Button } from "../../books/ui/button"
import { Textarea } from "../../books/ui/textarea"
import { Input } from "../../books/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card"
import { Badge } from "../../books/ui/badge"
import { ArrowLeft, Save, Plus, Trash2, Lightbulb } from "lucide-react"

const draftTags = ["idea", "scene", "dialogue", "character", "plot", "research", "inspiration"]

export default function DraftManager({ book, onBack, onSave }) {
  const [newDraft, setNewDraft] = useState({
    content: "",
    tag: "idea",
    customTag: "",
  })

  const handleSaveDraft = () => {
    if (!newDraft.content.trim()) return

    const draft = {
      id: Date.now(),
      content: newDraft.content.trim(),
      tag: newDraft.customTag || newDraft.tag,
      createdAt: new Date().toISOString(),
    }

    const updatedBook = {
      ...book,
      drafts: [...(book.drafts || []), draft],
      lastEdited: new Date().toISOString(),
    }

    onSave(updatedBook)

    setNewDraft({
      content: "",
      tag: "idea",
      customTag: "",
    })
  }

  const handleDeleteDraft = (draftId) => {
    const updatedBook = {
      ...book,
      drafts: book.drafts.filter((draft) => draft.id !== draftId),
      lastEdited: new Date().toISOString(),
    }
    onSave(updatedBook)
  }

  const getTagColor = (tag) => {
    const colors = {
      idea: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300",
      scene: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
      dialogue: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300",
      character: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300",
      plot: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300",
      research: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300",
      inspiration: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300",
    }
    return colors[tag] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex items-center gap-6 mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-3 hover:bg-primary/10 hover:text-primary transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              Draft Manager
            </h1>
            <p className="text-lg text-muted-foreground">{book.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Plus className="w-6 h-6 text-primary" />
                Capture New Draft
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <label htmlFor="tag" className="block text-sm font-semibold mb-3 text-foreground">
                  Draft Type
                </label>
                <div className="flex gap-3 mb-4">
                  <select
                    value={newDraft.tag}
                    onChange={(e) => setNewDraft({ ...newDraft, tag: e.target.value, customTag: "" })}
                    className="flex-1 px-4 py-3 border-2 border-input bg-background rounded-lg text-sm font-medium hover:border-primary transition-colors focus:border-primary focus:outline-none"
                  >
                    {draftTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </option>
                    ))}
                    <option value="custom">Custom...</option>
                  </select>
                </div>

                {newDraft.tag === "custom" && (
                  <Input
                    placeholder="Enter custom tag"
                    value={newDraft.customTag}
                    onChange={(e) => setNewDraft({ ...newDraft, customTag: e.target.value })}
                    className="border-2 focus:border-primary transition-colors"
                  />
                )}
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-semibold mb-3 text-foreground">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={newDraft.content}
                  onChange={(e) => setNewDraft({ ...newDraft, content: e.target.value })}
                  placeholder="Paste or write your draft content here..."
                  rows={12}
                  className="resize-none border-2 focus:border-primary transition-colors text-base leading-relaxed"
                  style={{ fontFamily: "Georgia, serif" }}
                />
              </div>

              <Button
                onClick={handleSaveDraft}
                disabled={!newDraft.content.trim()}
                className="w-full bg-primary hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-50 h-12 text-base font-medium"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Draft
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Lightbulb className="w-6 h-6 text-primary" />
                Saved Drafts ({book.drafts?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {!book.drafts || book.drafts.length === 0 ? (
                <div className="text-center py-16">
                  <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No drafts yet</h3>
                  <p className="text-muted-foreground">Capture your ideas and scenes as you write</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {book.drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="group p-6 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-card/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={`${getTagColor(draft.tag)} font-medium px-3 py-1`}>{draft.tag}</Badge>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground font-medium">
                            {new Date(draft.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed line-clamp-4" style={{ fontFamily: "Georgia, serif" }}>
                        {draft.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
