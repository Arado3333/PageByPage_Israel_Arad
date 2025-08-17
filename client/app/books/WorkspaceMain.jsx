"use client";

import { useEffect, useState, Suspense, use } from "react";
import BookLibrary from "../../app/books/book_components/book-library";
import BookWorkspace from "../../app/books/book_components/book-workspace";
import SectionEditor from "../../app/books/book_components/section-editor";
import NewProjectForm from "../../app/books/book_components/new-project-form";
import NoteEditor from "./book_components/NoteEditor";
import DraftEditor from "./book_components/DraftEditor";
import CharacterEditor from "./book_components/CharacterEditor";
import AssetEditor from "./book_components/AssetEditor";
import Draft from "../lib/models/draft.model.js";
import LibraryHeader from "./LibraryHeader";

import {
    createProject,
    updateBook,
} from "../api/routes.js";
import LibraryLoader from "./book_components/LibraryLoader";
import AssetViewer from "./book_components/AssetViewer";
import { redirectTo } from "../lib/actions.js";

export default function WorkspaceMain({ booksPromise }) {
    const [currentView, setCurrentView] = useState("library");
    const [selectedBook, setSelectedBook] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [books, setBooks] = useState([]);

    const handleOpenBook = (book) => {
        setSelectedBook(book);
        setCurrentView("workspace");
    };

    const handleEditSection = (section, type) => {
        setEditingSection({ ...section, type });
        switch (type) {
            case "draft":
                setCurrentView("editor");
                break;
            case "newDraft":
                setCurrentView("draftCreate");
                break;
            case "note":
                setCurrentView("noteEditor");
                break;
            case "character":
                setCurrentView("characterEditor");
                break;
            case "asset":
                setCurrentView("assetEditor");
                break;
            case "chapter":
                setCurrentView("draftCreate");
                break;
            default:
                setCurrentView("editor");
                break;
        }
    };

    function handleViewSection(section, type) {
        setEditingSection({ ...section, type });

        switch (type) {
            case "asset":
                setCurrentView("assetViewer");
                break;
        }
    }

    const handleNewProject = () => {
        setShowNewProjectForm(true);
        setCurrentView("newProject");
    };

    const handleCreateProject = async (projectData) => {
        const draftPages =
            JSON.parse(sessionStorage.getItem("bookDraft"))?.pages || [{id: 1, title: projectData.title, content: ""}];
        const drafts = new Draft(projectData.title, draftPages);
        const newBook = {
            title: projectData.title,
            author: projectData.author,
            status: projectData.status,
            lastEdited: new Date().toISOString(),
            genres: projectData.genres || [],
            description: projectData.description,
            drafts: [{...drafts}],
            notes: [],
            characters: [],
            assets: [],
        };
        const result = await createProject(newBook);
        sessionStorage.removeItem("bookDraft");
        setBooks([...books, newBook]);
        setCurrentView("library");
        setShowNewProjectForm(false);
        redirectTo("/books");
    };

    const handleUpdateBook = (updatedBook) => {
        setBooks(
            books.map((book) =>
                book.id === updatedBook.id ? updatedBook : book
            )
        );
        setSelectedBook(updatedBook);
        updateBookToServer(updatedBook);
    };

    const handleBackToLibrary = () => {
        setCurrentView("library");
        setSelectedBook(null);
        setEditingSection(null);
    };

    const handleBackToWorkspace = () => {
        setCurrentView("workspace");
        setEditingSection(null);
    };

    async function updateBookToServer(updatedBook) {
        const result = await updateBook(updatedBook);
        if (result?.success) {
            // updated successfully
        } else {
            // failed to update
        }
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case "library":
                return (
                    <>
                        <LibraryHeader onNewProject={handleNewProject} />
                        <Suspense fallback={<LibraryLoader />}>
                            <BookLibrary
                                booksPromise={booksPromise}
                                onOpenBook={handleOpenBook}
                                onUpdateBook={handleUpdateBook}
                            />
                        </Suspense>
                    </>
                );
            case "workspace":
                return (
                    <BookWorkspace
                        book={selectedBook}
                        onBack={handleBackToLibrary}
                        onEditSection={handleEditSection}
                        onViewSection={handleViewSection}
                        onUpdateBook={handleUpdateBook}
                    />
                );
            case "editor":
                return (
                    <SectionEditor
                        book={selectedBook}
                        section={editingSection}
                        onBack={handleBackToWorkspace}
                        onSave={handleUpdateBook}
                    />
                );
            case "characterEditor":
                return (
                    <CharacterEditor
                        book={selectedBook}
                        character={editingSection}
                        onBack={handleBackToWorkspace}
                        onSave={handleUpdateBook}
                    />
                );
            case "draftCreate":
                return (
                    <DraftEditor
                        book={selectedBook}
                        section={editingSection}
                        onBack={handleBackToWorkspace}
                        onSave={handleUpdateBook}
                    />
                );
            case "noteEditor":
                return (
                    <NoteEditor
                        book={selectedBook}
                        section={editingSection}
                        onBack={handleBackToWorkspace}
                        onSave={handleUpdateBook}
                    />
                );
            case "assetEditor":
                return (
                    <AssetEditor
                        book={selectedBook}
                        section={editingSection}
                        onBack={handleBackToWorkspace}
                        onSave={handleUpdateBook}
                    />
                );
            case "assetViewer":
                return (
                    <AssetViewer
                        asset={editingSection}
                        book={selectedBook}
                        onBack={handleBackToWorkspace}
                        onSave={handleUpdateBook}
                    />
                );
            case "newProject":
                return (
                    <NewProjectForm
                        onCreateProject={handleCreateProject}
                        onCancel={() => setCurrentView("library")}
                    />
                );
            default:
                return null;
        }
    };

    return <>{renderCurrentView()}</>;
}
