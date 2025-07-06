"use client";

import { useEffect, useState } from "react";
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

    let addedProjectIds = [] || JSON.parse(localStorage.getItem("projects"));

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
    }

    useEffect(() => {
        getProjects();
    }, []);

    const handleOpenBook = (book) => {
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
            drafts: [],
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
            projectid: result.message.insertedId,
            projectName: newBook.title,
        };
        addedProjectIds.push(objToAdd);

        localStorage.setItem("projects", JSON.stringify(addedProjectIds));

        setBooks([...books, newBook]);

        setCurrentView("library");
        setShowNewProjectForm(false);
    };

    async function handleDeleteProject(e) {
        e.preventDefault();

        // const { token, userID } = JSON.parse(sessionStorage.getItem("user"));

        // await fetch(`http://localhost:5500/api/projects/${userID}/${projId}`, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        //     method: "DELETE",
        // });

        // setBooks(books.filter((book) => book.id !== projId));

        // // Remove from localStorage as well
        // let storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
        // storedProjects = storedProjects.filter((p) => p.projectid !== projId);
        // localStorage.setItem("projects", JSON.stringify(storedProjects));
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
                        // onDeleteProject={handleDeleteProject}
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
