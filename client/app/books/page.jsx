"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookLibrary from "../../app/books/book_components/book-library";
import BookWorkspace from "../../app/books/book_components/book-workspace";
import SectionEditor from "../../app/books/book_components/section-editor";
import NewProjectForm from "../../app/books/book_components/new-project-form";
import NoteEditor from "./book_components/NoteEditor";
import DraftEditor from "./book_components/DraftEditor";
import CharacterEditor from "./book_components/CharacterEditor";
import AssetEditor from "./book_components/AssetEditor";
import Draft from "../lib/models/draft.model.js";
import { createProject, deleteBook, deleteProject, getProjectsWithCookies, getSession, getTokenFromCookies, updateBook } from "../api/routes.js";

export default function App() {
    const [currentView, setCurrentView] = useState("library");
    const [selectedBook, setSelectedBook] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [books, setBooks] = useState([]);
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [addedProjectIds, setProjectIds] = useState(null);

    const router = useRouter();

    async function fetchProjects() {
        const projects = await getProjectsWithCookies();
        setBooks(projects);
        console.log(projects);
    }

    useEffect(() => {
        const projectIds = JSON.parse(localStorage.getItem("projects")) || [];
        setProjectIds(projectIds);
        fetchProjects();
    }, []);

    const handleOpenBook = (book) => {
        console.log(book);

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
            default:
                setCurrentView("editor");
                break;
        }
    };

    function handleNoteEdit() {
        setCurrentView("noteEditor");
    }

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

    const handleNewProject = () => {
        setShowNewProjectForm(true);
        setCurrentView("newProject");
    };

    async function updateBookToServer(updatedBook) {
        console.log("Attempting to update book on server:", updatedBook);

        const keys = JSON.parse(sessionStorage.getItem("user"));
        if (!keys || !keys.token) {
            console.error("User token not found in sessionStorage.");
            return;
        }

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

    const handleCreateProject = async (projectData) => {
        const user = await getSession();
        const token = await getTokenFromCookies();

        const draftPages =
            JSON.parse(sessionStorage.getItem("bookDraft"))?.pages || [];

        // Use Draft class to create the drafts array
        const drafts = new Draft(projectData.title, draftPages);

        const newBook = {
            userId: user.userId,
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
        const result = await createProject(newBook, token);
        console.log(result);

        const objToAdd = {
            projectid: result.projectId,
            projectName: newBook.title,
        };

        addedProjectIds.push(objToAdd);
        console.log(addedProjectIds);

        localStorage.setItem("projects", JSON.stringify(addedProjectIds));
        sessionStorage.removeItem("bookDraft");

        setBooks([...books, newBook]);

        setCurrentView("library");
        setShowNewProjectForm(false);

        window.location.reload(true);
    };

    async function handleDeleteConfirm(projectName) {
        //get the projectId and delete from server
        const token = await getTokenFromCookies();

        const bookToDelete = books.filter((book) => {
            return book.title === projectName;
        });

        console.log(bookToDelete);
        
        const projDeletionConfirm = await deleteProject(bookToDelete[0]._id, token);
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

        window.location.reload(true);
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
