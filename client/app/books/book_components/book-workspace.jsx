"use client";

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
} from "lucide-react";

export default function BookWorkspace({
    book,
    onBack,
    onEditSection,
    onUpdateBook,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [tagFilter, setTagFilter] = useState("All");
    const [activeTab, setActiveTab] = useState("drafts");

    let id = 0;
    console.log(book.drafts);
    
    
    const allTags = [
        ...new Set([
            ...book.drafts.map((d) => d.tag),
            ...book.notes.map((n) => n.tag),
        ]),
    ].filter(Boolean);

    useEffect(() => {
        if (book) {
            // console.log(book);
        }
    });

    const handleAddDraft = () => {
        const newDraft = {
            id: id++,
            title: "New draft",
            content: "",
            tag: "scene",
            status: "draft",
            lastEdited: Date.now()
        };
        const updatedBook = {
            ...book,
            drafts: [...book.drafts, newDraft],
            lastEdited: new Date().toISOString(),
        };
        onUpdateBook(updatedBook);
        // Immediately edit the new draft
        onEditSection(newDraft, "draft");
    };

    const handleAddNote = () => {
        const newNote = {
            id: Date.now(),
            title: "New note",
            content: "",
            tag: "idea",
        };
        const updatedBook = {
            ...book,
            notes: [...book.notes, newNote],
            lastEdited: new Date().toISOString(),
        };
        onUpdateBook(updatedBook);
        // Immediately edit the new note
        onEditSection(newNote, "note");
    };

    const handleAddCharacter = () => {
        const newCharacter = {
            id: Date.now(),
            name: "New Character",
            role: "",
            notes: "",
        };
        const updatedBook = {
            ...book,
            characters: [...book.characters, newCharacter],
            lastEdited: new Date().toISOString(),
        };
        onUpdateBook(updatedBook);
        // Immediately edit the new character
        onEditSection(newCharacter, "character");
    };

    const handleAddAsset = () => {
        const newAsset = {
            id: Date.now(),
            name: "New Asset",
            type: "image",
            description: "",
        };
        const updatedBook = {
            ...book,
            assets: [...book.assets, newAsset],
            lastEdited: new Date().toISOString(),
        };
        onUpdateBook(updatedBook);
        // Immediately edit the new asset
        onEditSection(newAsset, "asset");
    };

    const handleViewAsset = (asset) => {
        // For now, just edit the asset
        onEditSection(asset, "asset");
    };

    const handleDeleteDraft = (draftId) => {
        const updatedDrafts = book.drafts.filter(
            (draft) => draft.id !== draftId
        );
        const updatedBook = {
            ...book,
            drafts: updatedDrafts,
            lastEdited: new Date().toISOString(),
        };
        onUpdateBook(updatedBook);
        // TODO: Add API call here to send the updatedBook to the server




        console.log(
            `Draft with ID ${draftId} removed from UI state. Server update needed.`
        );
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
            ?.toLowerCase()
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

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
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
                    <h1 className="text-2xl font-bold">{book.title}</h1>
                    <p className="text-muted">Active workspace</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--muted-foreground)" }}
                    />
                    <Input
                        placeholder="Search drafts and notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 input-field"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter
                        className="w-4 h-4"
                        style={{ color: "var(--muted-foreground)" }}
                    />
                    <select
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="px-3 py-2 input-field text-sm"
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
                <TabsList className="grid grid-cols-4 p-1 rounded-lg bg-muted overflow-x-auto">
                    <TabsTrigger
                        value="drafts"
                        className={`flex items-center gap-2 transition-all ${
                            activeTab === "drafts"
                                ? "tab-active"
                                : "tab-inactive"
                        }`}
                    >
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">Drafts</span>
                        <span className="sm:hidden">{book.drafts.length}</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="notes"
                        className={`flex items-center gap-2 transition-all ${
                            activeTab === "notes"
                                ? "tab-active"
                                : "tab-inactive"
                        }`}
                    >
                        <Lightbulb className="w-4 h-4" />
                        <span className="hidden sm:inline">Notes</span>
                        <span className="sm:hidden">{book.notes.length}</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="characters"
                        className={`flex items-center gap-2 transition-all ${
                            activeTab === "characters"
                                ? "tab-active"
                                : "tab-inactive"
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">Characters</span>
                        <span className="sm:hidden">
                            {book.characters?.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="assets"
                        className={`flex items-center gap-2 transition-all ${
                            activeTab === "assets"
                                ? "tab-active"
                                : "tab-inactive"
                        }`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Assets</span>
                        <span className="sm:hidden">{book.assets.length}</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="drafts">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
                        <h3 className="text-lg font-semibold">
                            Draft Scenes & Chapters
                        </h3>
                        <Button
                            onClick={handleAddDraft}
                            size="sm"
                            className="btn-primary transition-all hover:scale-105 mobile-full"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Draft
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDrafts.length === 0 ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                                <FileText
                                    className="w-12 h-12 mx-auto mb-4"
                                    style={{ color: "var(--muted-foreground)" }}
                                />
                                <p className="text-muted">
                                    No drafts found. Create your first draft!
                                </p>
                            </div>
                        ) : (
                            //TODO: save the drafts object in DB as chapters according to this pattern.
                            filteredDrafts.map((draft, index) => (
                                <Card
                                    key={index}
                                    id={index}
                                    className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <CardHeader className="pb-3 mobile-p">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-base">
                                                {draft.title}
                                            </CardTitle>
                                            <Badge
                                                className="badge-accent"
                                                variant="outline"
                                            >
                                                {draft.status || "Draft"}
                                            </Badge>
                                        </div>
                                        <Badge className="badge-muted text-xs mt-2">
                                            {draft.tag || "Scene"}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="mobile-p">
                                        <p className="text-sm line-clamp-3 mb-3 text-muted">
                                            {draft.content}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onEditSection(draft, "draft")
                                            }
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

                <TabsContent value="notes">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
                        <h3 className="text-lg font-semibold">
                            Research & Ideas
                        </h3>
                        <Button
                            onClick={handleAddNote}
                            size="sm"
                            className="btn-primary transition-all hover:scale-105 mobile-full"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Note
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNotes.length === 0 ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                                <Lightbulb
                                    className="w-12 h-12 mx-auto mb-4"
                                    style={{ color: "var(--muted-foreground)" }}
                                />
                                <p className="text-muted">
                                    No notes found. Add your first research note
                                    or idea!
                                </p>
                            </div>
                        ) : (
                            filteredNotes.map((note, index) => (
                                <Card
                                    key={index}
                                    className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <CardHeader className="pb-3 mobile-p">
                                        <CardTitle className="text-base">
                                            {note.title}
                                        </CardTitle>
                                        <Badge className="badge-muted text-xs mt-2">
                                            {note.tag}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="mobile-p">
                                        <p className="text-sm line-clamp-3 mb-3 text-muted">
                                            {note.content}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onEditSection(note, "note")
                                            }
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

                <TabsContent value="characters">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
                        <h3 className="text-lg font-semibold">
                            Character Profiles
                        </h3>
                        <Button
                            onClick={handleAddCharacter}
                            size="sm"
                            className="btn-primary transition-all hover:scale-105 mobile-full"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Character
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {book.characters?.length === 0 || !book.characters ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                                <Users
                                    className="w-12 h-12 mx-auto mb-4"
                                    style={{ color: "var(--muted-foreground)" }}
                                />
                                <p className="text-muted">
                                    No characters found. Create your first
                                    character profile!
                                </p>
                            </div>
                        ) : (
                            book.characters?.map((character, index) => (
                                <Card
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
                                            onClick={() =>
                                                onEditSection(
                                                    character,
                                                    "character"
                                                )
                                            }
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

                <TabsContent value="assets">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
                        <h3 className="text-lg font-semibold">
                            References & Assets
                        </h3>
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
                                    No assets found. Add your first reference or
                                    asset!
                                </p>
                            </div>
                        ) : (
                            book.assets.map((asset, index) => (
                                <Card
                                    key={index}
                                    className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <CardHeader className="pb-3 mobile-p">
                                        <CardTitle className="text-base">
                                            {asset.name}
                                        </CardTitle>
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
                                            onClick={() =>
                                                handleViewAsset(asset)
                                            }
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
    );
}
