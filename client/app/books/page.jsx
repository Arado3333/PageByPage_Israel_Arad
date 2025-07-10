"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookLibrary from "../../app/books/book_components/book-library";
import BookWorkspace from "../../app/books/book_components/book-workspace";
import SectionEditor from "../../app/books/book_components/section-editor";
import NewProjectForm from "../../app/books/book_components/new-project-form";

export default function App() {
    const [currentView, setCurrentView] = useState("library");
    const [selectedBook, setSelectedBook] = useState(null);
    const [editingSection, setEditingSection] = useState(null);
    const [books, setBooks] = useState([]);
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [addedProjectIds, setProjectIds] = useState(null);

    const router = useRouter();

    async function getProjects() {
        const { token, userID } = JSON.parse(sessionStorage.getItem("user"));

        //fetch projects from db
        const response = await fetch(
            `http://localhost:5500/api/projects/${userID}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "GET",
            }
        );
        const projects = await response.json();
        setBooks(projects);
        console.log(projects);
    }

    useEffect(() => {
        const projectIds = JSON.parse(localStorage.getItem("projects")) || [];
        setProjectIds(projectIds);
        getProjects();
    }, []);

    const handleOpenBook = (book) => {
        console.log(book);

        setSelectedBook(book);
        setCurrentView("workspace");
    };

    const handleEditSection = (section, type) => {
        setEditingSection({ ...section, type });
        setCurrentView("editor");
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

    const handleNewProject = () => {
        setShowNewProjectForm(true);
        setCurrentView("newProject");
    };

    async function updateBookToServer(updatedBook) {
        console.log("Attempting to update book on server:", updatedBook);

        try {
            const keys = JSON.parse(sessionStorage.getItem("user"));
            if (!keys || !keys.token) {
                console.error("User token not found in sessionStorage.");
                return;
            }

            const response = await fetch(
                `http://localhost:5500/api/projects/${updatedBook._id}`, //projectId
                {
                    headers: {
                        Authorization: `Bearer ${keys.token}`,
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                    body: JSON.stringify(updatedBook),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error(
                    "Failed to update book on server:",
                    response.status,
                    errorData
                );
                // TODO: Handle server-side errors (e.g., show a toast notification)
            } else {
                const result = await response.json();
                console.log("Book updated successfully on server:", result);
                // TODO: Handle successful server update (e.g., show a success message)
            }
        } catch (error) {
            console.error("Error sending update request to server:", error);
            // TODO: Handle network or other errors
        }
    }

    const handleCreateProject = async (projectData) => {
        const keys = JSON.parse(sessionStorage.getItem("user"));

        const newBook = {
            userId: keys.userID,
            title: projectData.title,
            author: projectData.author,
            status: projectData.status,
            lastEdited: new Date().toISOString(),
            genres: projectData.genres || [],
            description: projectData.description,
            drafts:
                JSON.parse(sessionStorage.getItem("bookDraft"))?.pages || [],
            notes: [],
            characters: [],
            assets: [],
        };

        //TODO: Complete Create new project
        const response = await fetch("http://localhost:5500/api/projects/", {
            headers: {
                Authentication: `Bearer ${keys.token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                userId: newBook.userId,
                author: newBook.author,
                title: newBook.title,
                genres: newBook.genres,
                status: newBook.status,
                description: newBook.description,
                drafts: newBook.drafts,
                notes: newBook.notes,
                characters: newBook.characters,
                assets: newBook.assets,
            }),
        });

        const result = await response.json();
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
    };

    async function handleDeleteConfirm(projectName) {
        //get the projectId and delete from server
        const { token, userID } = JSON.parse(sessionStorage.getItem("user"));

        const bookToDelete = books.filter((book) => {
            return book.title === projectName;
        });

        const idToDelete = bookToDelete[0]._id;

        const getBookResponse = await fetch(
            `http://localhost:5500/api/books/${idToDelete}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "GET",
            }
        );
        const bookObj = await getBookResponse.json();

        console.log(bookObj.book._id);

        const delBookResponse = await fetch(
            `http://localhost:5500/api/books/${bookObj.book._id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "DELETE",
            }
        );
        const delBookConfirm = await delBookResponse.json();

        const delProjResponse = await fetch(
            `http://localhost:5500/api/projects/${idToDelete}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "DELETE",
            }
        );
        const projDeletionConfirm = await delProjResponse.json();

        if (projDeletionConfirm.success && delBookConfirm.success) {
            // Remove deleted book from state
            setBooks(books.filter((book) => book._id !== idToDelete));

            // Remove from localStorage projects
            const updatedProjectIds = (
                JSON.parse(localStorage.getItem("projects")) || []
            ).filter((proj) => proj.projectName !== projectName);
            localStorage.setItem("projects", JSON.stringify(updatedProjectIds));
        }

        router.push("/books");
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
