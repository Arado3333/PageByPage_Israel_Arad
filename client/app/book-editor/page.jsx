"use client";

import { useState, useRef, useEffect } from "react";
import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    List,
    Quote,
    Sparkles,
    BookOpen,
    Plus,
    ChevronDown,
    Eye,
    Focus,
    Bookmark,
    X,
} from "lucide-react";
import "../../app//style/BookEditor.css";
import { useRouter } from "next/navigation";
import SaveModal from "./SaveModal";
import StatusMessage from "./StatusMessage";

import Draft from "../lib/models/draft.model.js";

export default function BookEditorPage() {
    let numPages = 1;

    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([
        { id: numPages, title: "", content: "" },
    ]);
    const [currentDrafts, setCurrentDrafts] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [showBookmarks, setShowBookmarks] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showBookmarkModal, setShowBookmarkModal] = useState(false);
    const [bookmarkName, setBookmarkName] = useState("");
    const [saveExistingBook, setSaveBook] = useState(false);
    const [fetchedProjects, setFetchedProjects] = useState(null);
    const [savedBookStatus, setSavedStatus] = useState({
        message: "",
        color: "",
    });
    const [popWarnMessage, setPopWarnMessage] = useState(false);

    const containerRef = useRef(null);
    const activeEditorRef = useRef(null);
    const router = useRouter();

    // Ref to hold the Draft object
    const draftRef = useRef(null);

    // Initialize Draft object on mount
    useEffect(() => {
        draftRef.current = new Draft({
            pages: [...pages],
            wordCount: wordCount,
        });
    }, []);

    // Update Draft object whenever pages or wordCount changes
    useEffect(() => {
        if (draftRef.current) {
            draftRef.current.pages = [...pages];
            draftRef.current.wordCount = wordCount;
        }
    }, [pages, wordCount]);

    // Calculate current page based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const scrollTop = containerRef.current.scrollTop;
                const pageHeight = 1200;
                const newPage = Math.floor(scrollTop / pageHeight) + 1;
                setCurrentPage(Math.min(newPage, pages.length));
            }
        };
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [pages.length]);

    useEffect(() => {
        if (fetchedProjects === null) {
            setSaveBook(false);
            setPopWarnMessage(true);
        }
    }, [popWarnMessage]);

    // Update word count
    useEffect(() => {
        const allContent = pages.map((page) => page.content).join(" ");
        const words = allContent
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0);
        setWordCount(words.length);
    }, [pages]);

    const formatText = (command, value) => {
        if (isPreviewMode) return;
        document.execCommand(command, false, value);
        if (activeEditorRef.current) activeEditorRef.current.focus();
    };

    const addNewPage = () => {
        const newPageId = draftRef.current.addPage();
        setPages([...pages, { id: newPageId, title: "", content: "" }]);
    };

    const updatePageContent = (pageId, content) => {
        const titleArr = content.split(" ");
        let draftTitle = "";
        for (let i = 0; i < 3; i++) {
            if (titleArr[i] == undefined) {
                break;
            }
            draftTitle += titleArr[i] + " ";
        }

        setPages(
            pages.map((page) =>
                page.id === pageId
                    ? { ...page, content, title: draftTitle }
                    : page
            )
        );
    };

    const addBookmark = () => {
        if (bookmarkName.trim()) {
            const newBookmark = {
                id: Date.now().toString(),
                name: bookmarkName.trim(),
                pageNumber: currentPage,
                position: containerRef.current?.scrollTop || 0,
            };
            setBookmarks([...bookmarks, newBookmark]);
            setBookmarkName("");
            setShowBookmarkModal(false);
        }
    };

    const scrollToBookmark = (bookmark) => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: bookmark.position,
                behavior: "smooth",
            });
        }
        setShowBookmarks(false);
    };

    const removeBookmark = (bookmarkId) => {
        setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
    };

    const scrollToPage = (pageNumber) => {
        if (containerRef.current) {
            const pageHeight = 1200;
            const targetPosition = (pageNumber - 1) * pageHeight;
            containerRef.current.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        }
        setShowBookmarks(false);
    };

    function handleCreateNewProject() {
        // Gather all pages content as a draft
        const draftContent = pages.map((page) => page.content).join("\n\n");

        // Store draft in sessionStorage to be used at /books route
        sessionStorage.setItem(
            "bookDraft",
            JSON.stringify({
                pages,
                draftContent,
                wordCount,
            })
        );

        router.push("/books");
        setTimeout(() => {
            document.querySelector(".new-project-btn").click();
        }, 1000);
    }

    async function getBooksFromServer() {
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
        return await response.json();
    }

    function addToDraftPages(existingDrafts) {
        //TODO: Handle the draft's new pages save. - not working properly

        // const existingLength = existingDrafts.pages.length;
        console.log(existingDrafts.pages);

        if (!existingDrafts[0].checkForEmptyPages()) {
            for (let i = 0; i < draftRef.current.pages.length; i++) {
                existingDrafts[0].pages.push(
                    draftRef.current.pages[existingLength + i]
                );
            }
            return true;
        }
        return false;
    }

    async function handleSaveExistingProject() {
        const projects = await getBooksFromServer();

        setFetchedProjects(projects);

        setSaveBook(true);
        setPopWarnMessage(false);
    }

    async function handleSaveProject(e) {
        e.preventDefault();

        const element = e.target;
        console.log(element);

        const projectName = element
            .querySelector("#project")
            .value.split(", ")[0];

        const status = element.querySelector("#status").value;

        const selectedProject = fetchedProjects.filter((project) => {
            return project.title === projectName;
        });

        // Initialize with existing drafts from the selected project
        const existingDrafts = selectedProject[0].drafts || [];

        console.log(existingDrafts);

        const draftContent = pages.map((page) => page.content).join("\\n\\n");

        //Update the Ref object
        draftRef.current.title = pages[0].title;
        draftRef.current.pages = pages;
        draftRef.current.draftContent = draftContent;
        draftRef.current.wordCount = wordCount;

        if (!addToDraftPages(existingDrafts)) {
            // Combine existing drafts with the new draft
            const updatedDrafts = [...existingDrafts, draftRef.current];
            console.log(updatedDrafts);

            // Update the state with the combined drafts (optional, but good practice)
            setCurrentDrafts(updatedDrafts);

            // Store draft in sessionStorage
            sessionStorage.setItem(
                "bookDraft",
                JSON.stringify({
                    pages,
                    draftContent,
                    wordCount,
                })
            );

            const result = updateToServer(
                selectedProject,
                updatedDrafts,
                status
            );

            setSavedStatus(() =>
                result.success
                    ? {
                          message: "Book saved successfully!",
                          color: "green",
                      }
                    : {
                          message:
                              "Error while saving the book. Please try again later",
                          color: "red",
                      }
            );

            setTimeout(() => {
                setSavedStatus("");
            }, 3000);
        }
    }

    async function updateToServer(selectedProject, updatedDrafts, status) {
        const keys = JSON.parse(sessionStorage.getItem("user"));

        const response = await fetch(
            `http://localhost:5500/api/projects/${selectedProject[0]._id}`,
            {
                headers: {
                    Authentication: `Bearer ${keys.token}`,
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify({
                    userId: keys.userID,
                    author: selectedProject[0].author,
                    title: selectedProject[0].title,
                    genres: selectedProject[0].genres,
                    status: status,
                    description: selectedProject[0].description,
                    drafts: updatedDrafts,
                }),
            }
        );

        setSaveBook(false);

        const result = await response.json();
        return result;
    }

    return (
        <div className="book-editor">
            {savedBookStatus.message && (
                <StatusMessage
                    message={savedBookStatus.message}
                    color={savedBookStatus.color}
                />
            )}

            {popWarnMessage && (
                <StatusMessage
                    message={
                        "You don't have any saved projects yet. Please create one first"
                    }
                    color={"yellow"}
                />
            )}

            <div className="editor-container">
                {/* Toolbar */}
                {!isFocusMode && (
                    <div className="toolbar">
                        <div className="toolbar-content">
                            <div className="toolbar-group">
                                <button
                                    onClick={() =>
                                        document
                                            .getElementById("my_modal_1")
                                            .showModal()
                                    }
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded save-button"
                                >
                                    Save
                                </button>
                                <dialog id="my_modal_1" className="modal">
                                    <div className="modal-box">
                                        <div className="modal-action">
                                            <form method="dialog">
                                                <button
                                                    onClick={
                                                        handleSaveExistingProject
                                                    }
                                                    className="btn-primary mb-2"
                                                >
                                                    Save Existing Book
                                                </button>
                                                <button
                                                    onClick={
                                                        handleCreateNewProject
                                                    }
                                                    className="btn-primary"
                                                >
                                                    Create New Book
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </dialog>

                                {/* TODO: Create a custom component for this section - save existing project */}
                                {saveExistingBook && (
                                    <section className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50 overflow-y-auto h-full w-full">
                                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                            <div className="mt-3 text-center">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                    Save To Existing Book
                                                    Project
                                                </h3>
                                                <form
                                                    onSubmit={handleSaveProject}
                                                    className="mt-2 px-7 py-3"
                                                >
                                                    <label
                                                        htmlFor="project"
                                                        className="block text-gray-700 text-sm font-bold mb-2"
                                                    >
                                                        Project:
                                                    </label>
                                                    <select
                                                        id="project"
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    >
                                                        {fetchedProjects.map(
                                                            (
                                                                project,
                                                                index
                                                            ) => (
                                                                <option
                                                                    key={index}
                                                                >
                                                                    {" "}
                                                                    {/* can add custom component with the options */}
                                                                    {project.title +
                                                                        ", " +
                                                                        project.author}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>

                                                    <label
                                                        htmlFor="status"
                                                        className="block text-gray-700 text-sm font-bold mt-4 mb-2"
                                                    >
                                                        Status:
                                                    </label>
                                                    <select
                                                        id="status"
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    >
                                                        <option>Draft</option>
                                                        <option>
                                                            In Progress
                                                        </option>
                                                        <option>
                                                            Completed
                                                        </option>
                                                    </select>
                                                    <div className="items-center px-4 py-3">
                                                        <button className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md shadow-sm hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSaveBook(
                                                                    false
                                                                );
                                                            }}
                                                            className="px-4 py-2 ml-4 bg-red-500 text-white font-bold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                <button
                                    className="btn-secondary preview-btn"
                                    onClick={() =>
                                        setIsPreviewMode(!isPreviewMode)
                                    }
                                >
                                    <Eye size={16} />
                                    {isPreviewMode ? "Edit" : "Preview"}
                                </button>
                            </div>

                            {!isPreviewMode && (
                                <>
                                    <div className="toolbar-group">
                                        <button
                                            className="toolbar-btn"
                                            onClick={() => formatText("bold")}
                                        >
                                            <Bold size={16} />
                                        </button>
                                        <button
                                            className="toolbar-btn"
                                            onClick={() => formatText("italic")}
                                        >
                                            <Italic size={16} />
                                        </button>
                                        <button
                                            className="toolbar-btn"
                                            onClick={() =>
                                                formatText("underline")
                                            }
                                        >
                                            <Underline size={16} />
                                        </button>
                                    </div>

                                    <div className="toolbar-group">
                                        <select
                                            onChange={(e) =>
                                                formatText(
                                                    "formatBlock",
                                                    e.target.value
                                                )
                                            }
                                            className="toolbar-select"
                                        >
                                            <option value="div">Normal</option>
                                            <option value="h1">
                                                Heading 1
                                            </option>
                                            <option value="h2">
                                                Heading 2
                                            </option>
                                            <option value="h3">
                                                Heading 3
                                            </option>
                                        </select>
                                    </div>

                                    <div className="toolbar-group">
                                        <button
                                            className="toolbar-btn"
                                            onClick={() =>
                                                formatText("justifyLeft")
                                            }
                                        >
                                            <AlignLeft size={16} />
                                        </button>
                                        <button
                                            className="toolbar-btn"
                                            onClick={() =>
                                                formatText(
                                                    "insertUnorderedList"
                                                )
                                            }
                                        >
                                            <List size={16} />
                                        </button>
                                        <button
                                            className="toolbar-btn"
                                            onClick={() =>
                                                formatText(
                                                    "formatBlock",
                                                    "blockquote"
                                                )
                                            }
                                        >
                                            <Quote size={16} />
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className="toolbar-group">
                                <button className="ai-btn">
                                    <Sparkles size={14} />
                                    AI Tools
                                </button>
                            </div>

                            <div className="toolbar-group ml-auto">
                                <button
                                    onClick={() => setShowBookmarkModal(true)}
                                    className="btn-secondary"
                                >
                                    <Bookmark size={14} />
                                    Bookmark
                                </button>

                                <div className="dropdown">
                                    <button
                                        onClick={() =>
                                            setShowBookmarks(!showBookmarks)
                                        }
                                        className="btn-secondary"
                                    >
                                        <BookOpen size={14} />
                                        Page {currentPage}
                                        <ChevronDown size={14} />
                                    </button>

                                    {showBookmarks && (
                                        <div className="dropdown-menu">
                                            <div className="dropdown-header">
                                                Navigation
                                            </div>
                                            <div className="dropdown-section">
                                                <div className="page-buttons">
                                                    {Array.from(
                                                        {
                                                            length: pages.length,
                                                        },
                                                        (_, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() =>
                                                                    scrollToPage(
                                                                        i + 1
                                                                    )
                                                                }
                                                                className="page-btn"
                                                                style={{
                                                                    backgroundColor:
                                                                        currentPage ===
                                                                        i + 1
                                                                            ? "var(--accent)"
                                                                            : "transparent",
                                                                    color:
                                                                        currentPage ===
                                                                        i + 1
                                                                            ? "white"
                                                                            : "inherit",
                                                                }}
                                                            >
                                                                {i + 1}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bookmarks-list">
                                                {bookmarks.map((bookmark) => (
                                                    <div
                                                        key={bookmark.id}
                                                        className="bookmark-item"
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                scrollToBookmark(
                                                                    bookmark
                                                                )
                                                            }
                                                            className="bookmark-btn"
                                                        >
                                                            <BookOpen
                                                                size={14}
                                                                style={{
                                                                    color: "var(--accent)",
                                                                }}
                                                            />
                                                            <div>
                                                                <div className="bookmark-name">
                                                                    {
                                                                        bookmark.name
                                                                    }
                                                                </div>
                                                                <div className="bookmark-page">
                                                                    Page{" "}
                                                                    {
                                                                        bookmark.pageNumber
                                                                    }
                                                                </div>
                                                            </div>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                removeBookmark(
                                                                    bookmark.id
                                                                )
                                                            }
                                                            className="remove-btn"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsFocusMode(!isFocusMode)}
                                    className="btn-secondary"
                                >
                                    <Focus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Bar */}
                {!isFocusMode && (
                    <div className="status-bar">
                        <div className="status-content">
                            <div className="status-left">
                                <span id="word-count">
                                    Words: {wordCount.toLocaleString()}
                                </span>
                                <span id="page-count">
                                    Pages: {pages.length}
                                </span>
                                <span id="current-page">
                                    Current: Page {currentPage}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Editor */}
                <div ref={containerRef} className="editor-area">
                    <div className="pages-container">
                        {pages.map((page, index) => (
                            <div key={index} className="page-wrapper">
                                <div id={`page-${index + 1}`} className="page">
                                    <div
                                        ref={
                                            index === 0 ? activeEditorRef : null
                                        }
                                        contentEditable={!isPreviewMode}
                                        suppressContentEditableWarning
                                        className="page-content"
                                        onInput={(e) =>
                                            updatePageContent(
                                                page.id,
                                                e.currentTarget.textContent ||
                                                    ""
                                            )
                                        }
                                        placeholder={
                                            index === 0
                                                ? "Start writing your story..."
                                                : ""
                                        }
                                    />
                                    <div className="page-number">
                                        Page {index + 1}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="add-page">
                            <button
                                id="add-page-btn"
                                onClick={addNewPage}
                                className="btn-secondary"
                            >
                                <Plus size={16} />
                                Add New Page
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bookmark Modal */}
                {showBookmarkModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Add Bookmark</h3>
                            <input
                                type="text"
                                value={bookmarkName}
                                onChange={(e) =>
                                    setBookmarkName(e.target.value)
                                }
                                placeholder="Enter bookmark name..."
                                className="modal-input"
                                autoFocus
                                onKeyPress={(e) =>
                                    e.key === "Enter" && addBookmark()
                                }
                            />
                            <div className="modal-actions">
                                <button
                                    onClick={() => setShowBookmarkModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addBookmark}
                                    className="btn-primary"
                                    disabled={!bookmarkName.trim()}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Focus Mode Exit */}
                {isFocusMode && (
                    <button
                        onClick={() => setIsFocusMode(false)}
                        className="focus-exit"
                    >
                        Exit Focus Mode
                    </button>
                )}
            </div>
        </div>
    );
}
