"use client";

import { useEffect, useState } from "react";
import BookLibrary from "../../app/books/book_components/book-library";
import BookWorkspace from "../../app/books/book_components/book-workspace";
import SectionEditor from "../../app/books/book_components/section-editor";
import NewProjectForm from "../../app/books/book_components/new-project-form";
import NoteEditor from "./book_components/NoteEditor";
import DraftEditor from "./book_components/DraftEditor";
import CharacterEditor from "./book_components/CharacterEditor";
import AssetEditor from "./book_components/AssetEditor";
import Draft from "../lib/models/draft.model.js";

import {
    createProject,
    deleteBook,
    deleteProject,
    getProjectsWithCookies,
    getTokenFromCookies,
    updateBook,
} from "../api/routes.js";

export default function Renderer() {
    const [currentView, setCurrentView] = useState("library");
    const [selectedBook, setSelectedBook] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [books, setBooks] = useState([]);

    const handleOpenBook = (book) => {
        console.log(book);

        setSelectedBook(book);
        setCurrentView("workspace");
    };

    async function fetchProjects() {
        const projects = await getProjectsWithCookies();
        setBooks(projects);
        console.log(projects);
    }

    useEffect(() => {
        fetchProjects();
    }, []);

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

    const handleNewProject = () => {
        setShowNewProjectForm(true);
        setCurrentView("newProject");
    };

    const handleCreateProject = async (projectData) => {
        const draftPages =
            JSON.parse(sessionStorage.getItem("bookDraft"))?.pages || [];

        // Use Draft class to create the drafts array
        const drafts = new Draft(projectData.title, draftPages);

        const newBook = {
            title: projectData.title,
            author: projectData.author,
            status: projectData.status,
            lastEdited: new Date().toISOString(),
            genres: projectData.genres || [],
            description: projectData.description,
            drafts: [drafts],
            notes: [],
            characters: [],
            assets: [],
        };

        // Send new project to server
        const result = await createProject(newBook);
        console.log(result);

        sessionStorage.removeItem("bookDraft");

        setBooks([...books, newBook]);

        setCurrentView("library");
        setShowNewProjectForm(false);

        window?.location?.reload(true);
    };

    const handleUpdateBook = (updatedBook) => {
        console.log(updatedBook);

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
        console.log("Attempting to update book on server:", updatedBook);

        const result = await updateBook(updatedBook);

        switch (result) {
            case result.success:
                console.log("updated successfuly to the server");
                break;
            case !result.success:
                console.log("failed to update to the server");
                break;
        }
    }

    async function handleDeleteConfirm(projectName) {
        //get the projectId and delete from server
        const token = await getTokenFromCookies();

        const bookToDelete = books.filter((book) => {
            return book.title === projectName;
        });

        console.log(bookToDelete);

        const projDeletionConfirm = await deleteProject(
            bookToDelete[0]._id,
            token
        );
        const delBookConfirm = await deleteBook(bookToDelete, token);

        if (projDeletionConfirm.success && delBookConfirm.success) {
            // Remove deleted book from state
            setBooks(books.filter((book) => book._id !== bookToDelete[0]._id));

            // Remove from localStorage projects
            const updatedProjectIds = (
                JSON.parse(localStorage.getItem("projects")) || []
            ).filter((proj) => proj.projectName !== projectName);
            localStorage.setItem("projects", JSON.stringify(updatedProjectIds));
        }

        window?.location?.reload(true);
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case "library":
                return (
                    <BookLibrary
                        books={books}
                        onOpenBook={handleOpenBook}
                        onUpdateBook={handleUpdateBook}
                        onNewProject={handleNewProject}
                        onDeleteConfirm={handleDeleteConfirm}
                    />
                );
            case "workspace":
                return (
                    <BookWorkspace
                        book={selectedBook}
                        onBack={handleBackToLibrary}
                        onEditSection={handleEditSection}
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

    return (
        <div className="min-h-screen bg-background text-foreground">
            {renderCurrentView()}
        </div>
    );
}
