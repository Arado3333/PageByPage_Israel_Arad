"use client";

// Drop-in replacement for your custom editor: swaps contentEditable/execCommand for Tiptap
// Preserves your layout, CSS classes, bookmarks, save flows, etc.

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignRight,
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
import StatusMessage from "../book-editor/StatusMessage";
import Draft from "../lib/models/draft.model.js";
import {
  getProjectsWithCookies,
  updateDataToServer,
  aiTextTool,
} from "../api/routes.js";
import { Button } from "../books/ui/button";

// --- Tiptap imports ---
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontSize from "@tiptap/extension-font-size";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";

// Helper: strip HTML for word-count/title generation
const htmlToText = (html = "") => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&amp;|&lt;|&gt;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Child page editor: one Tiptap instance per page
function PageEditor({ page, isPreviewMode, onUpdate, onFocus, placeholder }) {
  // Helper to detect RTL (Hebrew, Arabic, etc.)
  function isRTL(text) {
    return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
  }

  const editor = useEditor({
    immediatelyRender: false,
    editable: !isPreviewMode,
    content: page.content || placeholder,
    extensions: [
      TextStyle,
      Color,
      FontSize.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      StarterKit.configure({
        orderedList: { keepMarks: true },
        bulletList: { keepMarks: true },
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        text: true,
      }),
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const plain = editor.getText();
      const title = plain.split(" ").slice(0, 3).join(" ");
      onUpdate(page.id, html, title);
    },
    editorProps: {
      attributes: {
        class: "page-content",
        spellCheck: "true",
        style: isRTL(page.content || "")
          ? "text-align: right; direction: rtl;"
          : undefined,
        dir: isRTL(page.content || "") ? "rtl" : undefined,
      },
    },
  });

  // keep editable in sync
  useEffect(() => {
    editor?.setEditable(!isPreviewMode);
  }, [isPreviewMode, editor]);

  // reflect external content changes (e.g., AI insertion fallback)
  useEffect(() => {
    if (!editor) return;
  }, [page.content, editor]);

  // report focus so toolbar knows which editor to act on
  useEffect(() => {
    if (!editor) return;
    const handleFocus = () => onFocus?.(editor);
    editor.on("focus", handleFocus);
    return () => editor.off("focus", handleFocus);
  }, [editor, onFocus]);

  return <EditorContent editor={editor} />;
}

export default function BookEditorPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([{ id: 1, title: "", content: "" }]);
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
  const router = useRouter();

  // Track which page editor is active (focused) for toolbar actions
  const activeEditorRef = useRef(null);
  const setActiveEditor = useCallback((ed) => {
    activeEditorRef.current = ed;
  }, []);

  // Draft ref stores the structured draft object
  const draftRef = useRef(null);

  // Initialize Draft on mount
  useEffect(() => {
    // Only initialize a blank draft on mount. Do not auto-load draftContext.
    draftRef.current = new Draft({ pages: [...pages], wordCount });
  }, []);

  // Sync Draft whenever pages/wordCount change
  useEffect(() => {
    if (!draftRef.current) return;
    draftRef.current.pages = [...pages];
    draftRef.current.wordCount = wordCount;
  }, [pages, wordCount]);

  // Calculate current page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const pageEls = Array.from(container.querySelectorAll(".page-wrapper"));
      let newPage = 1;
      for (let i = 0; i < pageEls.length; i++) {
        const el = pageEls[i];
        const elTop = el.offsetTop - container.offsetTop;
        const elHeight = el.offsetHeight;
        const elBottom = elTop + elHeight;
        // If the next page is at least half visible from the top, switch to it
        if (i < pageEls.length - 1) {
          const nextEl = pageEls[i + 1];
          const nextTop = nextEl.offsetTop - container.offsetTop;
          const nextHeight = nextEl.offsetHeight;
          const nextVisible = scrollTop + containerHeight - nextTop;
          if (
            nextVisible >= nextHeight / 2 &&
            scrollTop < nextTop + nextHeight / 2
          ) {
            newPage = i + 2;
            continue;
          }
        }
        // If the current page is at least half visible, stay on it
        const visibleTop = Math.max(elTop, scrollTop);
        const visibleBottom = Math.min(elBottom, scrollTop + containerHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        if (visibleHeight >= elHeight / 2) {
          newPage = i + 1;
        }
      }
      setCurrentPage(newPage);
    };
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    // Run once on mount in case already scrolled
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [pages.length]);

  // Word count (from HTML contents)
  useEffect(() => {
    const all = pages.map((p) => htmlToText(p.content)).join(" ");
    const words = all
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    setWordCount(words.length);
  }, [pages]);

  // Toolbar mapping: replaces document.execCommand with Tiptap
  const formatText = (command, value) => {
    if (isPreviewMode) return;
    const ed = activeEditorRef.current;
    if (!ed) return;
    const chain = ed.chain().focus();
    switch (command) {
      case "bold":
        chain.toggleBold().run();
        break;
      case "italic":
        chain.toggleItalic().run();
        break;
      case "underline":
        chain.toggleUnderline().run();
        break;
      case "formatBlock": {
        if (value === "blockquote") chain.toggleBlockquote().run();
        else if (value === "h1") chain.toggleHeading({ level: 1 }).run();
        else if (value === "h2") chain.toggleHeading({ level: 2 }).run();
        else if (value === "h3") chain.toggleHeading({ level: 3 }).run();
        else chain.setParagraph().run();
        break;
      }
      case "justifyLeft":
        chain.setTextAlign("left").run();
        break;
      case "justifyRight":
        chain.setTextAlign("right").run();
        break;
      case "insertUnorderedList":
        chain.toggleBulletList().run();
        break;
      default:
        break;
    }
  };

  const addNewPage = () => {
    const newPageId = draftRef.current.addPage();
    setPages([...pages, { id: newPageId, title: "", content: "" }]);
  };

  const updatePageContent = (pageId, html, titleFromPage) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId ? { ...p, content: html, title: titleFromPage } : p
      )
    );
  };

  const addBookmark = () => {
    if (!bookmarkName.trim()) return;
    const newBookmark = {
      id: Date.now().toString(),
      name: bookmarkName.trim(),
      pageNumber: currentPage,
      position: containerRef.current?.scrollTop || 0,
    };
    setBookmarks([...bookmarks, newBookmark]);
    setBookmarkName("");
    setShowBookmarkModal(false);
  };

  const scrollToBookmark = (bookmark) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: bookmark.position,
      behavior: "smooth",
    });
    setShowBookmarks(false);
  };

  const removeBookmark = (bookmarkId) =>
    setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));

  const scrollToPage = (pageNumber) => {
    if (!containerRef.current) return;
    const pageHeight = 1200;
    const target = (pageNumber - 1) * pageHeight;
    containerRef.current.scrollTo({ top: target, behavior: "smooth" });
    setShowBookmarks(false);
  };

  function handleCreateNewProject() {
    const draftContent = pages.map((p) => htmlToText(p.content)).join("\n\n");
    sessionStorage.setItem(
      "bookDraft",
      JSON.stringify({ pages, draftContent, wordCount })
    );
    router.push("/books");
    setTimeout(() => {
      document.querySelector(".new-project-btn")?.click();
    }, 1000);
  }

  async function handleSaveExistingProject() {
    const projects = await getProjectsWithCookies();

    if (projects === null) {
      setPopWarnMessage(true);
    }
    setFetchedProjects(projects);
    setSaveBook(true);
    setPopWarnMessage(false);
  }

  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [projectDrafts, setProjectDrafts] = useState([]);
  const [selectedDraftIndex, setSelectedDraftIndex] = useState(null);
  const [createNewDraft, setCreateNewDraft] = useState(false);

  useEffect(() => {
    if (fetchedProjects && fetchedProjects.length > 0) {
      const drafts = fetchedProjects[selectedProjectIndex]?.drafts || [];
      setProjectDrafts(drafts);
    } else {
      setProjectDrafts([]);
    }
  }, [fetchedProjects, selectedProjectIndex]);

  // When user selects a draft to edit, load its pages into the editor
  useEffect(() => {
    if (
      projectDrafts.length > 0 &&
      selectedDraftIndex !== null &&
      projectDrafts[selectedDraftIndex]
    ) {
      setPages(
        projectDrafts[selectedDraftIndex].pages || [
          { id: 1, title: "", content: "" },
        ]
      );
    }
  }, [selectedDraftIndex, projectDrafts]);

  async function handleSaveProject(e) {
    e.preventDefault();
    const element = e.target;
    const projectName = element
      .querySelector("#project")
      .textContent.split(", ")[0];
    const status = element.querySelector("#status").value;
    const selectedProject = fetchedProjects.filter(
      (project) => project.title === projectName
    );
    const existingDrafts = selectedProject[0].drafts || [];

    const draftContent = pages.map((p) => htmlToText(p.content)).join("\n\n");

    draftRef.current.title = pages[0].title;
    draftRef.current.pages = pages;
    draftRef.current.draftContent = draftContent;
    draftRef.current.wordCount = wordCount;

    let updatedDrafts = [...existingDrafts];
    if (createNewDraft || existingDrafts.length === 0) {
      updatedDrafts.push({ ...draftRef.current });
    } else if (
      selectedDraftIndex !== null &&
      updatedDrafts[selectedDraftIndex]
    ) {
      updatedDrafts[selectedDraftIndex] = { ...draftRef.current };
    } else {
      updatedDrafts[0] = { ...draftRef.current };
    }

    setCurrentDrafts(updatedDrafts);

    sessionStorage.setItem(
      "bookDraft",
      JSON.stringify({ pages, draftContent, wordCount })
    );

    const context = sessionStorage.getItem("draftContext");
    if (context) sessionStorage.removeItem("draftContext");

    const result = await updateToServer(selectedProject, updatedDrafts, status);
    setSavedStatus(() =>
      result.success
        ? { message: "Book saved successfully!", color: "green" }
        : {
            message: "Error while saving the book. Please try again later",
            color: "red",
          }
    );
    setTimeout(() => setSavedStatus(""), 3000);
  }

  async function updateToServer(selectedProject, updatedDrafts, status) {
    const result = await updateDataToServer(
      selectedProject,
      updatedDrafts,
      status
    );
    setSaveBook(false);
    return result;
  }

  const [useAiTools, setUseAiTools] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiSelectedText, setAiSelectedText] = useState("");
  const [aiTool, setAiTool] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  async function handleAiTextTool(event) {
    let selectedText = "";
    const tool = event.target.innerHTML;

    // Get the current selection through Tiptap if available
    if (activeEditorRef.current) {
      selectedText = activeEditorRef.current.state.doc.textBetween(
        activeEditorRef.current.state.selection.from,
        activeEditorRef.current.state.selection.to,
        " "
      );
    } else {
      const selection = window.getSelection();
      if (selection) selectedText = selection.toString();
    }

    if (!selectedText || !tool)
      return alert("Please select some text before using AI tools.");

    try {
      // Set loading state and show modal immediately
      setIsAiLoading(true);
      setAiSelectedText(selectedText);
      setAiTool(tool);
      setShowAiModal(true);
      setUseAiTools(false);

      // Fetch the AI result
      const result = await aiTextTool({ text: selectedText, tool });
      console.log("AI result:", result);

      // Update with the result
      setAiResult(result);
      setIsAiLoading(false);

      return result;
    } catch (err) {
      console.error("AI request failed:", err);
      setIsAiLoading(false);
      setAiResult("AI request failed. Please try again.");
      return "AI request failed.";
    }
  }

  function handleKeepOriginal() {
    setShowAiModal(false);
  }

  function handleUseAiResult() {
    if (activeEditorRef.current) {
      const { from, to } = activeEditorRef.current.state.selection;
      activeEditorRef.current
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(aiResult) // Insert text without color styling
        .run();
    } else {
      setPages((prev) =>
        prev.map((p, idx) => {
          if (idx + 1 !== currentPage) return p;
          return {
            ...p,
            content: (p.content || "").replace(aiSelectedText, aiResult),
          };
        })
      );
    }
    setShowAiModal(false);
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
                    document.getElementById("my_modal_1").showModal()
                  }
                  className="btn-primary"
                >
                  Save
                </button>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box">
                    <div className="modal-action">
                      <form method="dialog">
                        <button
                          onClick={handleSaveExistingProject}
                          className="btn-primary mb-2"
                        >
                          Save Existing Book
                        </button>
                        <button
                          onClick={handleCreateNewProject}
                          className="btn-primary"
                        >
                          Create New Book
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>

                {/* Save to existing project */}
                {saveExistingBook && (
                  <section className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                      <div className="mt-3 text-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Save To Existing Book Project
                        </h3>
                        <form
                          onSubmit={handleSaveProject}
                          className="mt-2 px-7 py-3"
                          name="save-draft"
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
                            value={selectedProjectIndex}
                            onChange={(e) => {
                              setSelectedProjectIndex(Number(e.target.value));
                              setSelectedDraftIndex(null);
                              setCreateNewDraft(false);
                            }}
                          >
                            {fetchedProjects?.map((project, index) => (
                              <option key={index} value={index}>
                                {project.title + ", " + project.author}
                              </option>
                            ))}
                          </select>

                          <label
                            htmlFor="draft"
                            className="block text-gray-700 text-sm font-bold mt-4 mb-2"
                          >
                            Draft:
                          </label>
                          <select
                            id="draft"
                            value={
                              createNewDraft
                                ? "new"
                                : selectedDraftIndex !== null
                                ? selectedDraftIndex
                                : ""
                            }
                            onChange={(e) => {
                              if (e.target.value === "new") {
                                setCreateNewDraft(true);
                                setSelectedDraftIndex(null);
                              } else {
                                setSelectedDraftIndex(
                                  e.target.value !== ""
                                    ? Number(e.target.value)
                                    : null
                                );
                                setCreateNewDraft(false);
                              }
                            }}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          >
                            <option value="">
                              -- Select Existing Draft --
                            </option>
                            {projectDrafts.map((draft, idx) => (
                              <option key={idx} value={idx}>
                                {draft.title || `Draft ${idx + 1}`}
                              </option>
                            ))}
                            <option key="new" value="new">
                              New Draft
                            </option>
                          </select>
                          <button
                            type="button"
                            className="mt-2 mb-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                            onClick={() => {
                              setCreateNewDraft(true);
                              setSelectedDraftIndex(null);
                            }}
                          >
                            + Create New Draft
                          </button>

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
                            <option>In Progress</option>
                            <option>Completed</option>
                          </select>
                          <div className="items-center px-4 py-3">
                            <button className="btn-primary">Confirm</button>
                            <button
                              type="button"
                              onClick={() => {
                                setSaveBook(false);
                                setSelectedDraftIndex(null);
                                setCreateNewDraft(false);
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
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
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
                      onClick={() => formatText("underline")}
                    >
                      <UnderlineIcon size={16} />
                    </button>
                  </div>

                  <div className="toolbar-group">
                    <select
                      onChange={(e) =>
                        formatText("formatBlock", e.target.value)
                      }
                      className="toolbar-select"
                    >
                      <option value="div">Normal</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="blockquote">Quote</option>
                    </select>
                  </div>

                  <div className="toolbar-group">
                    <button
                      className="toolbar-btn"
                      onClick={() => formatText("justifyLeft")}
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      className="toolbar-btn"
                      onClick={() => formatText("justifyRight")}
                    >
                      <AlignRight size={16} />
                    </button>
                    <button
                      className="toolbar-btn"
                      onClick={() => formatText("insertUnorderedList")}
                    >
                      <List size={16} />
                    </button>
                    <button
                      className="toolbar-btn"
                      onClick={() => formatText("formatBlock", "blockquote")}
                    >
                      <Quote size={16} />
                    </button>
                  </div>
                </>
              )}

              <div className="toolbar-group">
                <button
                  onClick={() => setUseAiTools(!useAiTools)}
                  className="btn-primary"
                >
                  <Sparkles size={14} />
                  AI Tools
                </button>

                {useAiTools && (
                  <div
                    className="absolute z-10 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div className="py-1" role="none">
                      <button
                        onClick={handleAiTextTool}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:bg-blue-100 focus:text-blue-900"
                        role="menuitem"
                      >
                        Improve
                      </button>
                      <button
                        onClick={handleAiTextTool}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:bg-blue-100 focus:text-blue-900"
                        role="menuitem"
                      >
                        Summarize
                      </button>
                      <button
                        onClick={handleAiTextTool}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:bg-blue-100 focus:text-blue-900"
                        role="menuitem"
                      >
                        Expand
                      </button>
                      <button
                        onClick={handleAiTextTool}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:bg-blue-100 focus:text-blue-900"
                        role="menuitem"
                      >
                        Rewrite
                      </button>
                      <Button
                        style={{ fontWeight: 600 }}
                        onClick={() => setUseAiTools(!useAiTools)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
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
                    onClick={() => setShowBookmarks(!showBookmarks)}
                    className="btn-secondary"
                  >
                    <BookOpen size={14} />
                    Page {currentPage}
                    <ChevronDown size={14} />
                  </button>

                  {showBookmarks && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">Navigation</div>
                      <div className="dropdown-section">
                        <div className="page-buttons">
                          {Array.from(
                            {
                              length: pages.length,
                            },
                            (_, i) => (
                              <button
                                key={i}
                                onClick={() => scrollToPage(i + 1)}
                                className="page-btn"
                                style={{
                                  backgroundColor:
                                    currentPage === i + 1
                                      ? "var(--accent)"
                                      : "transparent",
                                  color:
                                    currentPage === i + 1 ? "white" : "inherit",
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
                          <div key={bookmark.id} className="bookmark-item">
                            <button
                              onClick={() => scrollToBookmark(bookmark)}
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
                                  {bookmark.name}
                                </div>
                                <div className="bookmark-page">
                                  Page {bookmark.pageNumber}
                                </div>
                              </div>
                            </button>
                            <button
                              onClick={() => removeBookmark(bookmark.id)}
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
                <span id="word-count">Words: {wordCount.toLocaleString()}</span>
                <span id="page-count">Pages: {pages.length}</span>
                <span id="current-page">Current: Page {currentPage}</span>
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
                  {/* Tiptap replaces contentEditable here */}
                  <PageEditor
                    page={page}
                    isPreviewMode={isPreviewMode}
                    placeholder={"Start writing your story..."}
                    onUpdate={updatePageContent}
                    onFocus={setActiveEditor}
                  />
                  <div className="page-number">Page {index + 1}</div>
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
                onChange={(e) => setBookmarkName(e.target.value)}
                placeholder="Enter bookmark name..."
                className="modal-input"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && addBookmark()}
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

        {/* AI Comparison Modal */}
        {showAiModal && (
          <div className="modal-overlay">
            <div className="modal" style={{ width: "80%", maxWidth: "800px" }}>
              <h3>AI {aiTool} Result</h3>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <h4 style={{ marginBottom: "5px" }}>Original Text:</h4>
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "#ffebee",
                      borderRadius: "4px",
                      color: "#d32f2f",
                    }}
                  >
                    {aiSelectedText}
                  </div>
                </div>
                <div>
                  <h4 style={{ marginBottom: "5px" }}>AI Result:</h4>
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "#e3f2fd",
                      borderRadius: "4px",
                      color: "#1976d2",
                      minHeight: "100px",
                      overflow: "auto",
                    }}
                  >
                    {isAiLoading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100px",
                        }}
                      >
                        <div className="loading-spinner"></div>
                        <span
                          style={{
                            marginLeft: "10px",
                          }}
                        >
                          Generating AI Suggestions...
                        </span>
                      </div>
                    ) : aiResult !== "" ? (
                      aiResult
                    ) : (
                      "No Suggestions Avaliable"
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button onClick={handleKeepOriginal} className="btn-secondary">
                  Keep Original
                </button>
                <button
                  onClick={handleUseAiResult}
                  className="btn-primary"
                  disabled={isAiLoading}
                >
                  Use Generated Suggestion
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Focus Mode Exit */}
        {isFocusMode && (
          <button onClick={() => setIsFocusMode(false)} className="focus-exit">
            Exit Focus Mode
          </button>
        )}
      </div>
    </div>
  );
}
