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

export default function BookEditorPage() {
    const [pages, setPages] = useState([{ id: "1", content: "" }]);
    const [bookmarks, setBookmarks] = useState([]);
    const [showBookmarks, setShowBookmarks] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [wordCount, setWordCount] = useState(0);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showBookmarkModal, setShowBookmarkModal] = useState(false);
    const [bookmarkName, setBookmarkName] = useState("");

    const [saveExistingBook, setSaveBook] = useState(false);
    const [fetchedProjects, setFetchedProjects] = useState([]);
    const [savedBookStatus, setSavedStaus] = useState("");

    const containerRef = useRef(null);
    const activeEditorRef = useRef(null);
    const router = useRouter();

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
        setPages([...pages, { id: Date.now().toString(), content: "" }]);
    };

    const updatePageContent = (pageId, content) => {
        setPages(
            pages.map((page) =>
                page.id === pageId ? { ...page, content } : page
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
        router.push("/books");
        setTimeout(() => {
            document.querySelector(".new-project-btn").click();
        }, 1000);

        //TODO: insert the current content as a draft to the project
    }

    //TODO: Optional - Pre-fetch the data on page load. (server component)
    async function handleSaveExistingProject() {
        const { token, userID } = JSON.parse(sessionStorage.getItem("user"));
        console.log(userID);
        
        //fetch projects from db
        const response = await fetch(`http://localhost:5500/api/projects/${userID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
        });
        const projects = await response.json();
        
        setSaveBook(true);
        setFetchedProjects(projects);
        console.log(projects);
        
    }

    async function handleSaveProject(e)
    {
        e.preventDefault();
        
        
    }

    return (
        <div className="book-editor">
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

                                {saveExistingBook && (
                                    <section className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50 overflow-y-auto h-full w-full">
                                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                            <div className="mt-3 text-center">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                    Save To Existing Book
                                                    Project
                                                </h3>
                                                <form onSubmit={handleSaveProject} className="mt-2 px-7 py-3">
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
                                                        {fetchedProjects.map((project, index) => (
                                                          <option key={index}> {/* can add custom component with the options */}
                                                            {project.title + ", " + project.author}
                                                          </option>
                                                        ))}
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
                                                </form>
                                                <div className="items-center px-4 py-3">
                                                    <button className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md shadow-sm hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                                                        Confirm
                                                    </button>
                                                </div>
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
                                <span>Words: {wordCount.toLocaleString()}</span>
                                <span>Pages: {pages.length}</span>
                                <span>Current: Page {currentPage}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Editor */}
                <div ref={containerRef} className="editor-area">
                    <div className="pages-container">
                        {pages.map((page, index) => (
                            <div key={page.id} className="page-wrapper">
                                <div className="page">
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
