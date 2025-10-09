"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { Search, Plus, Heart, Edit, Eye, Trash2 } from "lucide-react";

export default function LibraryPage({
  books,
  onNewBook,
  onEditBook,
  onViewBook,
  onDeleteBook,
  onToggleFavorite,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Last Updated");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredAndSortedBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        book.tags.some((tag) =>
          tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Favorites"
          ? book.isFavorite
          : book.status === statusFilter);
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "A-Z":
          return a.title.localeCompare(b.title);
        case "Progress":
          return b.wordCount - a.wordCount;
        case "Last Updated":
        default:
          return new Date(b.lastEdited) - new Date(a.lastEdited);
      }
    });
  }, [books, debouncedSearchTerm, statusFilter, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Books Library</h1>
        <Button onClick={onNewBook} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Book
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search books and tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="All">All</option>
            <option value="Draft">Drafts</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
            <option value="Favorites">Favorites</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="Last Updated">Last Updated</option>
            <option value="A-Z">A-Z</option>
            <option value="Progress">Progress</option>
          </select>
        </div>
      </div>

      {filteredAndSortedBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {books.length === 0
              ? "No books yet. Create your first book!"
              : "No books match your filters."}
          </p>
          {books.length === 0 && (
            <Button onClick={onNewBook}>Create Your First Book</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">
                    {book.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(book.id)}
                    className="p-1"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        book.isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>
                <Badge className={getStatusColor(book.status)}>
                  {book.status}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{book.wordCount.toLocaleString()} words</span>
                  <span>{book.chapterCount} chapters</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Last edited: {formatDate(book.lastEdited)}
                </p>

                {book.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {book.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {book.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{book.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewBook(book)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditBook(book)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteBook(book.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
