"use client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookPdf from "./BookPdf";

import { useEffect, useState } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../books/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Edit,
  Search,
  Filter,
  FileText,
  Users,
  ImageIcon,
  Lightbulb,
  Eye,
  BookOpenText,
} from "lucide-react";
import Note from "../../lib/models/note.model.js";
import Draft from "../../lib/models/draft.model.js";
import Character from "../../lib/models/character.model.js";
import Asset from "../../lib/models/asset.model.js";

export default function BookWorkspace({
  book,
  onBack,
  onEditSection,
  onViewSection,
  onUpdateBook,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("drafts");
  const [hasChapters, setHasChapters] = useState(true); //default is disabled

  useEffect(() => {
    if (book.chapters.length > 0) {
      setHasChapters(false);
    }
  }, [book.chapters]);

  const allTags = [
    ...new Set([
      ...book.drafts.map((d) => d.tag),
      ...book.notes.map((n) => n.tag),
    ]),
  ].filter(Boolean);

  const handleAddDraft = () => {
    const newDraft = new Draft("New Draft", [
      { id: 1, title: "", content: "", editorContent: null },
    ]); //initializes new empty draft object

    // Immediately edit the new draft
    onEditSection(newDraft, "newDraft");
  };

  const handleAddNote = () => {
    const newNote = new Note(); //initializes new empty note --> model
    const updatedBook = {
      ...book,
      notes: [...book.notes, { ...newNote }],
      lastEdited: new Date().toISOString(),
    };
    onUpdateBook(updatedBook);
    // Immediately edit the new note
    onEditSection(newNote, "note");
  };

  const handleAddCharacter = () => {
    const newCharacter = new Character();
    console.log(newCharacter);

    const updatedBook = {
      ...book,
      characts: [...book.characts, { ...newCharacter }],
      lastEdited: new Date().toISOString(),
    };
    onUpdateBook(updatedBook);
    // Immediately edit the new character
    onEditSection(newCharacter, "character");
  };

  const handleAddAsset = () => {
    const newAsset = new Asset("New Asset", "image", "");

    // Immediately edit the new asset
    onEditSection(newAsset, "asset");
  };

  const handleViewAsset = (asset) => {
    console.log(asset);
    onViewSection(asset, "asset");
  };

  const handleViewChapter = (chapter) => {
    // For now, just edit the asset
    onEditSection(chapter, "chapter"); //TODO: Add the chapter section to the editor
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "complete":
        return { backgroundColor: "var(--success)", color: "white" };
      case "editing":
        return {
          backgroundColor: "var(--accent-secondary)",
          color: "var(--accent-foreground)",
        };
      default:
        return {
          backgroundColor: "var(--accent)",
          color: "var(--accent-foreground)",
        };
    }
  };

  const filteredDrafts = book.drafts.filter((draft) => {
    const matchesSearch = draft.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTag = tagFilter === "All" || draft.tag === tagFilter;
    return matchesSearch && matchesTag;
  });

  const filteredNotes = book.notes.filter((note) => {
    const matchesSearch = note.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTag = tagFilter === "All" || note.tag === tagFilter;
    return matchesSearch && matchesTag;
  });

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const [showPdfDownload, setShowPdfDownload] = useState(false);
  async function handleFinalizeBook() {
    // Optionally update the latest version to server here
    setShowPdfDownload(true);
  }

  return (
    <div className="min-h-screen text-slate-800">
      {/* Decorative blobs - matching library page */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Hero Section */}
        <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 mb-6 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                <BookOpenText className="w-4 h-4" />
                Active Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0F1A2E] mb-2">
                {book.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-600">
                Manage your drafts, notes, characters, and assets
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search drafts and notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="All">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-5 p-1 rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-x-auto">
            <TabsTrigger
              value="drafts"
              className={`flex items-center gap-2 transition-all duration-300 ease-in-out rounded-lg ${
                activeTab === "drafts"
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Drafts</span>
              <span className="sm:hidden">{book.drafts.length}</span>
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className={`flex items-center gap-2 transition-all duration-300 ease-in-out rounded-lg ${
                activeTab === "notes"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Notes</span>
              <span className="sm:hidden">{book.notes.length}</span>
            </TabsTrigger>
            <TabsTrigger
              value="characters"
              className={`flex items-center gap-2 transition-all duration-300 ease-in-out rounded-lg ${
                activeTab === "characters"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Characters</span>
              <span className="sm:hidden">{book.characts.length}</span>
            </TabsTrigger>
            <TabsTrigger
              value="assets"
              className={`flex items-center gap-2 transition-all duration-300 ease-in-out rounded-lg ${
                activeTab === "assets"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Assets</span>
              <span className="sm:hidden">{book.assets.length}</span>
            </TabsTrigger>
            <TabsTrigger
              value="chapters"
              className={`flex items-center gap-2 transition-all duration-300 ease-in-out rounded-lg ${
                activeTab === "chapters"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <BookOpenText className="w-4 h-4" />
              <span className="hidden sm:inline">Chapters</span>
              <span className="sm:hidden">{book.chapters?.length}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drafts" className="m-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Draft Scenes & Chapters
              </h3>
              <Button
                onClick={handleAddDraft}
                size="sm"
                className="bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mobile-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Draft
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDrafts.length === 0 ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">
                    No drafts found. Create your first draft!
                  </p>
                </div>
              ) : (
                filteredDrafts.map((draft, index) => (
                  <Card
                    key={index}
                    id={index}
                    className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Gradient Header */}
                    <div className="h-2 bg-gradient-to-r from-indigo-300 to-violet-500" />
                    <CardHeader className="pb-3 p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base text-slate-800">
                          {draft.title}
                        </CardTitle>
                        <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2 py-1 text-xs">
                          {draft.status || "Draft"}
                        </Badge>
                      </div>
                      <Badge className="bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-2 py-1 text-xs mt-2">
                        {draft.tag || "Scene"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm line-clamp-3 mb-3 text-slate-600">
                        {draft.pages?.[0]?.content || "No Content"}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditSection(draft, "draft")}
                        className="w-full bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="m-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Research & Ideas
              </h3>
              <Button
                onClick={handleAddNote}
                size="sm"
                className="bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mobile-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.length === 0 ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">
                    No notes found. Add your first research note or idea!
                  </p>
                </div>
              ) : (
                filteredNotes.map((note, index) => (
                  <Card
                    id={index}
                    key={index}
                    className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Gradient Header */}
                    <div className="h-2 bg-gradient-to-r from-emerald-300 to-teal-500" />
                    <CardHeader className="pb-3 p-4">
                      <CardTitle className="text-base text-slate-800">
                        {note.title}
                      </CardTitle>
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-1 text-xs mt-2">
                        {note.tag}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm line-clamp-3 mb-3 text-slate-600">
                        {note.content}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditSection(note, "note")}
                        className="w-full bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="characters" className="m-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Character Profiles
              </h3>
              <Button
                onClick={handleAddCharacter}
                size="sm"
                className="bg-gradient-to-r from-pink-700 to-rose-700 hover:from-pink-800 hover:to-rose-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mobile-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Character
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {book.characts.length === 0 || !book.characts ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                  <Users
                    className="w-12 h-12 mx-auto mb-4"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <p className="text-muted">
                    No characters found. Create your first character profile!
                  </p>
                </div>
              ) : (
                book.characts.map((character, index) => (
                  <Card
                    id={index}
                    key={index}
                    className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader className="pb-3 mobile-p">
                      <CardTitle className="text-base">
                        {character.name}
                      </CardTitle>
                      <Badge className="badge-muted text-xs mt-2">
                        {character.role}
                      </Badge>
                    </CardHeader>
                    <CardContent className="mobile-p">
                      <p className="text-sm line-clamp-3 mb-3 text-muted">
                        {character.notes}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditSection(character, "character")}
                        className="btn-outline w-full transition-all hover:scale-105"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="assets" className="m-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
              <h3 className="text-lg font-semibold">References & Assets</h3>
              <Button
                onClick={handleAddAsset}
                size="sm"
                className="btn-primary transition-all hover:scale-105 mobile-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {book.assets?.length === 0 ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                  <ImageIcon
                    className="w-12 h-12 mx-auto mb-4"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <p className="text-muted">
                    No assets found. Add your first reference or asset!
                  </p>
                </div>
              ) : (
                book.assets.map((asset, index) => (
                  <Card
                    key={index}
                    className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader className="pb-3 mobile-p">
                      <CardTitle className="text-base">{asset.name}</CardTitle>
                      <Badge className="badge-muted text-xs mt-2">
                        {asset.type}
                      </Badge>
                    </CardHeader>
                    <CardContent className="mobile-p">
                      <p className="text-sm line-clamp-3 mb-3 text-muted">
                        {asset.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAsset(asset)}
                        className="btn-outline w-full transition-all hover:scale-105"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="chapters" className="m-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
              <h3 className="text-lg font-semibold">Chapters</h3>
              <Button
                disabled={hasChapters}
                onClick={handleFinalizeBook}
                size="sm"
                className="btn-primary transition-all hover:scale-105 mobile-full"
              >
                <BookOpenText className="w-4 h-4 mr-2" />
                Finalize Book
              </Button>
            </div>
            {showPdfDownload && (
              <PDFDownloadLink
                document={<BookPdf book={book} />}
                fileName={`${book.title || "book"}.pdf`}
                style={{ marginLeft: 16 }}
              >
                {({ loading }) =>
                  loading ? "Preparing PDF..." : "Download PDF"
                }
              </PDFDownloadLink>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {book.chapters?.length === 0 ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                  <BookOpenText
                    className="w-12 h-12 mx-auto mb-4"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <p className="text-muted">
                    Your finished chapters will appear here.
                  </p>
                </div>
              ) : (
                book.chapters?.map((chapter, index) => (
                  <Card
                    key={index}
                    className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader className="pb-3 mobile-p">
                      <CardTitle className="text-base">
                        {chapter.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mobile-p">
                      <p className="text-sm line-clamp-3 mb-3 text-muted">
                        {chapter.pages[0].content}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewChapter(chapter)}
                        className="btn-outline w-full transition-all hover:scale-105"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
