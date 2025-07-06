"use client";

import { useState } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { Search, FolderOpen, Plus, Filter } from "lucide-react";

export default function BookLibrary({
    books,
    onOpenBook,
    onUpdateBook,
    onNewProject,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [tagFilter, setTagFilter] = useState("All");
    const [deleteMode, setDeleteMode] = useState(false);

    const allTags = [...new Set(books.flatMap((book) => book.genres))];

    const filteredBooks = books.filter((book) => {
        const matchesSearch = book.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesTag = tagFilter === "All" || book.tags.includes(tagFilter);
        return matchesSearch && matchesTag;
    });

    const getDraftCount = (book) => book.drafts?.length || 0;
    const getNotesCount = (book) => book.notes?.length || 0;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Book Workspace</h1>
                    <p className="text-muted">
                        Manage your active writing projects
                    </p>
                </div>
                <div className="inline-flex gap-2">
                    <Button
                        className="new-project-btn btn-primary font-medium mobile-full"
                        onClick={() => onNewProject()}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                    {deleteMode ? (
                        <DeleteProject /> //NOT FINAL - Find a way to select for deletion
                    ) : (
                        <Button className="bg-red-500 hover:bg-red-700 text-white">
                            Delete Project
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--muted-foreground)" }}
                    />
                    <Input
                        placeholder="Search projects..."
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((book, index) => (
                    <Card
                    id={index}
                        key={index}
                        className="card hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    >
                        <CardHeader className="pb-3 mobile-p">
                            <div className="flex justify-between items-start">
                                <CardTitle
                                    className="text-lg"
                                    style={{ color: "var(--foreground)" }}
                                >
                                    {book.title}
                                </CardTitle>
                                <Badge className="badge-muted">
                                    {book.status}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {book.genres.map((tag) => (
                                    <Badge
                                        className="badge-accent text-xs"
                                        key={tag}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="mobile-p">
                            <div
                                className="space-y-2 text-sm"
                                style={{ color: "var(--muted-foreground)" }}
                            >
                                <div className="flex justify-between">
                                    <span>Drafts:</span>
                                    <span
                                        className="font-medium"
                                        style={{ color: "var(--foreground)" }}
                                    >
                                        {getDraftCount(book)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Notes:</span>
                                    <span
                                        className="font-medium"
                                        style={{ color: "var(--foreground)" }}
                                    >
                                        {getNotesCount(book)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Characters:</span>
                                    <span
                                        className="font-medium"
                                        style={{ color: "var(--foreground)" }}
                                    >
                                        {book.characters?.length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Assets:</span>
                                    <span
                                        className="font-medium"
                                        style={{ color: "var(--foreground)" }}
                                    >
                                        {book.assets?.length || 0}
                                    </span>
                                </div>
                            </div>
                            <Button
                                className="btn-outline w-full mt-4"
                                onClick={() => onOpenBook(book)}
                            >
                                <FolderOpen className="w-4 h-4 mr-2" />
                                Open Workspace
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
