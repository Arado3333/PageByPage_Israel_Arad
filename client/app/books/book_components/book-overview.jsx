"use client"

import { useState } from "react"
import { Button } from "../../books/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card"
import { Badge } from "../../books/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../books/ui/tabs"
import { Progress } from "../../books/ui/progress"
import { ArrowLeft, Edit, Plus, FileText, Users, MapPin, ImageIcon, Zap, BookOpen, Target, Clock } from "lucide-react"

export default function BookOverview({ book, onBack, onEditSection, onAddDraft, onUpdateBook }) {
  const [activeTab, setActiveTab] = useState("chapters")

  const getStatusStyle = (status) => {
    switch (status) {
      case "Published":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300"
      case "Archived":
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
    }
  }

  const getChapterStatusStyle = (status) => {
    switch (status) {
      case "Complete":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center gap-6 mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-3 hover:bg-primary/10 hover:text-primary transition-all rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              {book.title}
            </h1>
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusStyle(book.status)} font-medium px-3 py-1`}>{book.status}</Badge>
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatDate(book.lastEdited)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-primary" />
                <div className="text-3xl font-bold text-primary">{book.progress}%</div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Progress</p>
              <Progress value={book.progress} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div className="text-3xl font-bold text-blue-600">{book.wordCount.toLocaleString()}</div>
              </div>
              <p className="text-sm text-muted-foreground">Words</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-6 h-6 text-emerald-600" />
                <div className="text-3xl font-bold text-emerald-600">{book.chapterCount}</div>
              </div>
              <p className="text-sm text-muted-foreground">Chapters</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-purple-600" />
                <div className="text-3xl font-bold text-purple-600">{Math.ceil(book.wordCount / 250)}</div>
              </div>
              <p className="text-sm text-muted-foreground">Pages (est.)</p>
            </CardContent>
          </Card>
        </div>

        {book.description && (
          <Card className="mb-8 border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl">Story Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger
              value="chapters"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Chapters</span>
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger
              value="characters"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Characters</span>
            </TabsTrigger>
            <TabsTrigger
              value="locations"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Locations</span>
            </TabsTrigger>
            <TabsTrigger
              value="assets"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Assets</span>
            </TabsTrigger>
            <TabsTrigger
              value="ai-tools"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">AI Tools</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chapters">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl">Chapters</CardTitle>
                <Button
                  onClick={() => onAddDraft(book)}
                  className="bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Draft
                </Button>
              </CardHeader>
              <CardContent>
                {book.chapters.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No chapters yet. Start writing to create your first chapter.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {book.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="group p-6 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-card/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {chapter.title}
                              </h4>
                              <Badge className={`${getChapterStatusStyle(chapter.status)} font-medium`}>
                                {chapter.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{chapter.wordCount.toLocaleString()} words</p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => onEditSection(book, "chapter", chapter)}
                            className="hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl">Notes & Ideas</CardTitle>
                <Button
                  onClick={() => onEditSection(book, "notes", book.notes)}
                  className="bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Notes
                </Button>
              </CardHeader>
              <CardContent>
                {book.notes ? (
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{book.notes}</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Edit className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notes yet. Add notes to track ideas and research.</p>
                  </div>
                )}

                {book.drafts && book.drafts.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Recent Drafts</h4>
                    <div className="space-y-3">
                      {book.drafts.map((draft) => (
                        <div
                          key={draft.id}
                          className="p-4 border-2 rounded-lg hover:border-primary/30 transition-colors bg-card/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {draft.tag}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(draft.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm line-clamp-2">{draft.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="characters">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Characters</CardTitle>
              </CardHeader>
              <CardContent>
                {book.characters.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No characters defined yet. Create character profiles to track development.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {book.characters.map((character) => (
                      <div
                        key={character.id}
                        className="p-6 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-card/50"
                      >
                        <h4 className="text-lg font-semibold mb-2">{character.name}</h4>
                        <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
                          {character.role}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{character.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Locations</CardTitle>
              </CardHeader>
              <CardContent>
                {book.locations.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No locations defined yet. Track important places in your story.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {book.locations.map((location) => (
                      <div
                        key={location.id}
                        className="p-6 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-card/50"
                      >
                        <h4 className="text-lg font-semibold mb-3">{location.name}</h4>
                        <p className="text-sm text-muted-foreground">{location.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Assets & References</CardTitle>
              </CardHeader>
              <CardContent>
                {book.assets.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No assets uploaded yet. Store images, documents, and research materials.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {book.assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="p-6 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-card/50"
                      >
                        <h4 className="font-semibold mb-2">{asset.name}</h4>
                        <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">
                          {asset.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{asset.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-tools">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">AI Writing Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-gradient-to-br from-primary/5 to-primary/10 cursor-pointer group">
                    <Zap className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">Content Analysis</h4>
                    <p className="text-sm text-muted-foreground">Analyze writing style and structure</p>
                  </div>
                  <div className="p-6 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 cursor-pointer group">
                    <Users className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      Character Development
                    </h4>
                    <p className="text-sm text-muted-foreground">Generate character insights and arcs</p>
                  </div>
                  <div className="p-6 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 cursor-pointer group">
                    <Target className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                      Plot Suggestions
                    </h4>
                    <p className="text-sm text-muted-foreground">Get plot development ideas</p>
                  </div>
                  <div className="p-6 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 cursor-pointer group">
                    <Edit className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors">Grammar Check</h4>
                    <p className="text-sm text-muted-foreground">Advanced grammar and style checking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
