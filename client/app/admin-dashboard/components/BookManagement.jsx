"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  User,
  Calendar,
} from "lucide-react";
import { getTokenFromCookies } from "../../lib/clientAuth.js";
import { logBookEvent } from "../../lib/logManager";

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [activeAuthorFilter, setActiveAuthorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookDetail, setShowBookDetail] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(activeSearchTerm && { search: activeSearchTerm }),
        ...(activeAuthorFilter && { author: activeAuthorFilter }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/books?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      let booksData = [];
      if (Array.isArray(data)) {
        booksData = data;
        setTotalPages(1); // API doesn't return pagination info
      } else if (data.success) {
        booksData = data.books || [];
        setTotalPages(data.pagination?.pages || 1);
      }

      // Apply client-side filtering as fallback
      let filteredBooks = booksData;

      if (activeSearchTerm) {
        filteredBooks = filteredBooks.filter(
          (book) =>
            book.title
              ?.toLowerCase()
              .includes(activeSearchTerm.toLowerCase()) ||
            book.author
              ?.toLowerCase()
              .includes(activeSearchTerm.toLowerCase()) ||
            book.genres?.some((genre) =>
              genre.toLowerCase().includes(activeSearchTerm.toLowerCase())
            )
        );
      }

      if (activeAuthorFilter) {
        filteredBooks = filteredBooks.filter((book) =>
          book.author?.toLowerCase().includes(activeAuthorFilter.toLowerCase())
        );
      }

      setBooks(filteredBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeSearchTerm, activeAuthorFilter]);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchTerm, activeAuthorFilter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    setActiveAuthorFilter(authorFilter);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
    setAuthorFilter("");
    setActiveAuthorFilter("");
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setShowBookDetail(true);
  };

  const handleDeleteBook = async (book) => {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        const token = getTokenFromCookies();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVICE}/api/books/${book._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          // Log the book deletion
          logBookEvent(
            "Book deleted",
            null, // No specific user for admin actions
            "admin",
            {
              action: "delete_book",
              bookId: book._id,
              bookTitle: book.title,
              bookAuthor: book.author,
              timestamp: new Date().toISOString(),
            }
          );

          fetchBooks(); // Refresh the list
        } else {
          alert("Failed to delete book");
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book");
      }
    }
  };

  const getGenreBadges = (genres) => {
    if (!genres || genres.length === 0) {
      return <Badge variant="secondary">No genres</Badge>;
    }
    return genres.slice(0, 3).map((genre, index) => (
      <Badge key={index} variant="outline" className="mr-1">
        {genre}
      </Badge>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Book Management
          </h2>
          <p className="text-gray-600">Manage books and their details</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                {(searchTerm ||
                  activeSearchTerm ||
                  authorFilter ||
                  activeAuthorFilter) && (
                  <Button
                    onClick={handleClearSearch}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Filter by author..."
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>Books ({books.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Author</th>
                  <th className="text-left p-2">Genres</th>
                  <th className="text-left p-2">Chapters</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{book.title}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {book.author}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {getGenreBadges(book.genres)}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary">
                        {book.chapters?.length || 0} chapters
                      </Badge>
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {book.createdAt
                          ? new Date(book.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewBook(book)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBook(book)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {books.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No books found matching your criteria.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Book Detail Modal */}
      {showBookDetail && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Book Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBookDetail(false)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium">Title:</label>
                    <p className="text-sm text-gray-600">
                      {selectedBook.title}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium">Author:</label>
                    <p className="text-sm text-gray-600">
                      {selectedBook.author}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium">Project ID:</label>
                    <p className="text-sm text-gray-600">
                      {selectedBook.projectId}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium">Created:</label>
                    <p className="text-sm text-gray-600">
                      {selectedBook.createdAt
                        ? new Date(selectedBook.createdAt).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="font-medium">Genres:</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedBook.genres && selectedBook.genres.length > 0 ? (
                      selectedBook.genres.map((genre, index) => (
                        <Badge key={index} variant="outline">
                          {genre}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">
                        No genres specified
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-medium">
                    Chapters ({selectedBook.chapters?.length || 0}):
                  </label>
                  {selectedBook.chapters && selectedBook.chapters.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {selectedBook.chapters.map((chapter, index) => (
                        <div key={index} className="p-2 bg-gray-100 rounded">
                          <div className="font-medium">Chapter {index + 1}</div>
                          <div className="text-sm text-gray-600">
                            {chapter.title || "Untitled Chapter"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      No chapters available
                    </p>
                  )}
                </div>

                {selectedBook.coverImg && (
                  <div>
                    <label className="font-medium">Cover Image:</label>
                    <div className="mt-2">
                      <img
                        src={selectedBook.coverImg}
                        alt="Book cover"
                        className="max-w-xs h-auto rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
