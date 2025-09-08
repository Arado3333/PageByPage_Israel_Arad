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
  ListOrdered,
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

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  TextStyle,
  BackgroundColor,
  FontFamily,
} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontSize from "@tiptap/extension-font-size";
import { Placeholder } from "@tiptap/extension-placeholder";
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

// Helper: check if font is available
const isFontAvailable = (fontFamily) => {
  const testString = "abcdefghijklmnopqrstuvwxyz0123456789";
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Get the width with the font
  context.font = `16px ${fontFamily}`;
  const widthWithFont = context.measureText(testString).width;

  // Get the width with a fallback font
  context.font = "16px monospace";
  const widthWithFallback = context.measureText(testString).width;

  return widthWithFont !== widthWithFallback;
};

// Child page editor: one Tiptap instance per page
function PageEditor({ page, isPreviewMode, onUpdate, onFocus }) {
  // Helper to detect RTL (Hebrew, Arabic, etc.)
  function isRTL(text) {
    return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
  }

  // Track if content has been initially loaded
  const hasInitialContentLoaded = useRef(false);

  // Debounce update calls to prevent excessive updates
  const updateTimeoutRef = useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !isPreviewMode,
    parseOptions: {
      preserveWhitespace: "full",
    },
    extensions: [
      StarterKit.configure({
        orderedList: {
          keepMarks: true,
          HTMLAttributes: {
            class: "ordered-list",
          },
        },
        bulletList: {
          keepMarks: true,
          HTMLAttributes: {
            class: "bullet-list",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "list-item",
          },
        },
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        marks: {
          bold: true,
          italic: true,
          underline: true,
          strike: true,
        },
        paragraph: true,
        text: true,
      }),
      Placeholder.configure({ placeholder: "Start writing your story..." }),
      TextStyle,
      FontFamily.configure({
        types: ["textStyle", "paragraph", "heading"],
      }),
      Color,
      FontSize.configure({ types: ["textStyle", "paragraph", "heading"] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      BackgroundColor,
    ],
    onUpdate: ({ editor }) => {
      // Clear existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Debounce the update to prevent excessive calls
      updateTimeoutRef.current = setTimeout(() => {
        const plain = editor.getText();
        const json = editor.getJSON();
        const title = plain.split(" ").slice(0, 3).join(" ");

        // Save both plain text and JSON content to preserve all formatting including fonts
        // The JSON content contains all the formatting information (fonts, colors, etc.)
        onUpdate(page.id, plain, title, json);
      }, 100); // 100ms debounce
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

  // Reset initial content flag when page changes
  useEffect(() => {
    hasInitialContentLoaded.current = false;
  }, [page.id]);

  // Load content when page.editorContent changes - only on initial load
  useEffect(() => {
    if (editor && !hasInitialContentLoaded.current && !editor.isDestroyed) {
      try {
        // Only load content on initial load
        if (page.editorContent) {
          // Ensure we're setting the full JSON content to preserve all formatting including fonts
          if (typeof page.editorContent === "object") {
            editor.commands.setContent(page.editorContent);
          } else if (typeof page.editorContent === "string") {
            // If it's a string, try to parse it as JSON first
            try {
              const parsedContent = JSON.parse(page.editorContent);
              editor.commands.setContent(parsedContent);
            } catch {
              // If parsing fails, treat it as plain text
              editor.commands.setContent(page.editorContent);
            }
          }
        } else if (page.content) {
          // If there's no editorContent but there's plain content, load it
          editor.commands.setContent(page.content);
        }

        hasInitialContentLoaded.current = true;
      } catch (error) {
        console.error("Error loading editor content:", error);
        // Fallback to plain text content
        editor.commands.setContent(page.content || "");
        hasInitialContentLoaded.current = true;
      }
    }
  }, [editor, page.editorContent, page.content]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

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

  // Preserve focus during content updates
  useEffect(() => {
    if (!editor) return;

    // Store current selection before any content changes
    const handleBeforeUpdate = () => {
      if (editor.isFocused) {
        const { from, to } = editor.state.selection;
        editor.view.dom.setAttribute("data-selection-from", from);
        editor.view.dom.setAttribute("data-selection-to", to);
      }
    };

    // Restore selection after content changes
    const handleUpdate = () => {
      if (editor.isFocused) {
        const from = editor.view.dom.getAttribute("data-selection-from");
        const to = editor.view.dom.getAttribute("data-selection-to");
        if (from && to) {
          try {
            const fromPos = parseInt(from);
            const toPos = parseInt(to);
            if (
              fromPos >= 0 &&
              toPos >= 0 &&
              fromPos <= editor.state.doc.content.size &&
              toPos <= editor.state.doc.content.size
            ) {
              editor.commands.setTextSelection({ from: fromPos, to: toPos });
            }
          } catch (error) {
            // If restoration fails, just keep the current selection
          }
        }
      }
    };

    editor.on("beforeUpdate", handleBeforeUpdate);
    editor.on("update", handleUpdate);

    return () => {
      editor.off("beforeUpdate", handleBeforeUpdate);
      editor.off("update", handleUpdate);
    };
  }, [editor]);

  // For preview mode, show formatted content
  if (isPreviewMode) {
    return (
      <div className="page-content formatted-preview">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: editor?.getHTML() || page.content || "",
          }}
        />
      </div>
    );
  }

  return <EditorContent editor={editor} />;
}

export default function BookEditorPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([
    { id: 1, title: "", content: "", editorContent: null },
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
  const router = useRouter();

  // Track which page editor is active (focused) for toolbar actions
  const activeEditorRef = useRef(null);
  const setActiveEditor = useCallback((ed) => {
    activeEditorRef.current = ed;
  }, []);

  // Draft ref stores the structured draft object
  const draftRef = useRef(null);

  // Initialize Draft on mount and load draft context if available
  useEffect(() => {
    // Check if there's draft context to load
    const draftContext = sessionStorage.getItem("draftContext");
    if (draftContext) {
      try {
        const parsedDraft = JSON.parse(draftContext);
        if (parsedDraft.pages && parsedDraft.pages.length > 0) {
          // Load the draft pages with their editorContent
          setPages(
            parsedDraft.pages.map((page) => ({
              id: page.id || Date.now(),
              title: page.title || "",
              content: page.content || "",
              editorContent: page.editorContent || page.content,
            }))
          );
          // Clear the draft context after loading
          sessionStorage.removeItem("draftContext");
        }
      } catch (error) {
        console.error("Error loading draft context:", error);
        sessionStorage.removeItem("draftContext");
      }
    }

    // Initialize draft ref
    draftRef.current = new Draft({ pages: [...pages], wordCount });

    // Check font availability after fonts load
    const checkFonts = () => {
      const fonts = [
        "Open Sans",
        "Roboto",
        "Heebo",
        "Noto Sans Hebrew",
        "Noto Serif Hebrew",
        "Playpen Sans Hebrew",
        "Rubik",
        "Caveat",
        "Pacifico",
      ];

      fonts.forEach((font) => {
        const available = isFontAvailable(font);
        console.log(
          `Font ${font} is ${available ? "available" : "NOT available"}`
        );
      });
    };

    // Check fonts after a delay
    setTimeout(checkFonts, 2000);

    // Also check when fonts are loaded
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        console.log("All fonts loaded");
        checkFonts();
      });
    }
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

  // Word count (from plain text contents)
  useEffect(() => {
    const all = pages.map((p) => p.content || "").join(" ");
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
      case "insertOrderedList":
        chain.toggleOrderedList().run();
        break;
      case "setFontFamily":
        chain.setFontFamily(value).run();
        break;
      default:
        break;
    }
  };

  const addNewPage = () => {
    const newPageId = draftRef.current.addPage();
    setPages([
      ...pages,
      { id: newPageId, title: "", content: "", editorContent: null },
    ]);
  };

  const updatePageContent = (pageId, html, titleFromPage, editorContent) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId
          ? {
              ...p,
              content: html,
              title: titleFromPage,
              editorContent: editorContent,
            }
          : p
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
    // Use plain text content directly for draftContent
    const draftContent = pages.map((p) => p.content || "").join("\n\n");
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
  const shouldLoadDraftRef = useRef(false);

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
    // Only load draft content when user explicitly selects a draft
    // Don't load if we're in the middle of saving
    if (
      projectDrafts.length > 0 &&
      selectedDraftIndex !== null &&
      projectDrafts[selectedDraftIndex] &&
      !saveExistingBook && // Don't load during save operation
      shouldLoadDraftRef.current // Only load when explicitly requested
    ) {
      const selectedDraft = projectDrafts[selectedDraftIndex];
      setPages(
        selectedDraft.pages || [
          { id: 1, title: "", content: "", editorContent: null },
        ]
      );
      shouldLoadDraftRef.current = false; // Reset the flag
    }
  }, [selectedDraftIndex, projectDrafts, saveExistingBook]);

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

    // Use plain text content directly for draftContent
    const draftContent = pages.map((p) => p.content || "").join("\n\n");

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

    console.log(updatedDrafts);
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

    if (!selectedText || !tool) {
      setAiResult("Please select some text before using AI tools.");
      setAiSelectedText(selectedText || "");
      setAiTool(tool || "");
      setShowAiModal(true);
      setUseAiTools(false);
      return;
    }

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

      // Check if result is valid
      if (result && typeof result === "string" && result.trim() !== "") {
        setAiResult(result);
      } else {
        setAiResult(
          "AI tool completed but returned no content. Please try again."
        );
      }

      setIsAiLoading(false);

      return result;
    } catch (err) {
      console.error("AI request failed:", err);
      setIsAiLoading(false);

      // Graceful error handling with user-friendly messages
      let errorMessage = "AI request failed. Please try again later.";

      if (err.message) {
        if (err.message.includes("network") || err.message.includes("fetch")) {
          errorMessage =
            "Network error. Please check your internet connection and try again.";
        } else if (err.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (
          err.message.includes("rate limit") ||
          err.message.includes("quota")
        ) {
          errorMessage =
            "Rate limit exceeded. Please wait a moment and try again.";
        } else if (
          err.message.includes("unauthorized") ||
          err.message.includes("401")
        ) {
          errorMessage =
            "Authentication error. Please refresh the page and try again.";
        } else if (
          err.message.includes("server") ||
          err.message.includes("500")
        ) {
          errorMessage = "Server error. Please try again in a few minutes.";
        }
      }

      setAiResult(errorMessage);
      setAiSelectedText(selectedText);
      setAiTool(tool);
      setShowAiModal(true);
      setUseAiTools(false);

      return errorMessage;
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
        .insertContent(aiResult)
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
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-30" />
      </div>

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
                  className="btn-primary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2 text-center"
                >
                  Save
                </button>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box">
                    <div className="modal-action">
                      <form method="dialog">
                        <button
                          onClick={handleSaveExistingProject}
                          className="btn-primary mb-2 bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
                        >
                          Save Existing Book
                        </button>
                        <button
                          onClick={handleCreateNewProject}
                          className="btn-primary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
                        >
                          Create New Book
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>

                <button
                  className="btn-secondary preview-btn bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  <Eye size={16} />
                  {isPreviewMode ? "Edit" : "Preview"}
                </button>
              </div>

              {!isPreviewMode && (
                <>
                  <div className="toolbar-group hidden md:flex">
                    <button
                      className="toolbar-btn hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                      onClick={() => formatText("bold")}
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      className="toolbar-btn hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                      onClick={() => formatText("italic")}
                    >
                      <Italic size={16} />
                    </button>
                    <button
                      className="toolbar-btn hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                      onClick={() => formatText("underline")}
                    >
                      <UnderlineIcon size={16} />
                    </button>
                  </div>

                  <div className="toolbar-group hidden md:flex">
                    <select
                      onChange={(e) =>
                        formatText("formatBlock", e.target.value)
                      }
                      className="toolbar-select rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      <option value="div">Normal</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="blockquote">Quote</option>
                    </select>
                  </div>

                  <div className="toolbar-group hidden md:flex">
                    <select
                      onChange={(e) =>
                        formatText("setFontFamily", e.target.value)
                      }
                      className="toolbar-select rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      style={{ minWidth: "120px" }}
                    >
                      <option value="">Font</option>
                      <option
                        value="Georgia, serif"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        Georgia
                      </option>
                      <option
                        value="Open Sans, sans-serif"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Open Sans
                      </option>
                      <option
                        value="Roboto, sans-serif"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        Roboto
                      </option>
                      <option
                        value="Heebo, sans-serif"
                        style={{ fontFamily: "Heebo, sans-serif" }}
                      >
                        Heebo
                      </option>
                      <option
                        value="Noto Sans Hebrew, sans-serif"
                        style={{ fontFamily: "Noto Sans Hebrew, sans-serif" }}
                      >
                        Noto Sans Hebrew
                      </option>
                      <option
                        value="Noto Serif Hebrew, serif"
                        style={{ fontFamily: "Noto Serif Hebrew, serif" }}
                      >
                        Noto Serif Hebrew
                      </option>
                      <option
                        value="Playpen Sans Hebrew, sans-serif"
                        style={{
                          fontFamily: "Playpen Sans Hebrew, sans-serif",
                        }}
                      >
                        Playpen Sans Hebrew
                      </option>
                      <option
                        value="Rubik, sans-serif"
                        style={{ fontFamily: "Rubik, sans-serif" }}
                      >
                        Rubik
                      </option>
                      <option
                        value="Caveat, cursive"
                        style={{ fontFamily: "Caveat, cursive" }}
                      >
                        Caveat
                      </option>
                      <option
                        value="Pacifico, cursive"
                        style={{ fontFamily: "Pacifico, cursive" }}
                      >
                        Pacifico
                      </option>
                    </select>
                  </div>

                  <div className="toolbar-group hidden md:flex">
                    <button
                      className="toolbar-btn hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                      onClick={() => formatText("justifyLeft")}
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      className="toolbar-btn hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                      onClick={() => formatText("justifyRight")}
                    >
                      <AlignRight size={16} />
                    </button>
                    <button
                      className="toolbar-btn hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                      onClick={() => formatText("insertUnorderedList")}
                    >
                      <List size={16} />
                    </button>
                    <button
                      className="toolbar-btn hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                      onClick={() => formatText("insertOrderedList")}
                    >
                      <ListOrdered size={16} />
                    </button>
                    <button
                      className="toolbar-btn hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
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
                  className="btn-primary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
                >
                  <Sparkles size={14} />
                  AI Tools
                </button>

                {useAiTools && (
                  <div
                    className="ai-tools-menu"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      zIndex: 1000,
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      padding: "8px",
                      minWidth: "200px",
                    }}
                  >
                    <button
                      onClick={handleAiTextTool}
                      className="ai-tool-btn"
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        borderRadius: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      Improve
                    </button>
                    <button
                      onClick={handleAiTextTool}
                      className="ai-tool-btn"
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        borderRadius: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      Rewrite
                    </button>
                    <button
                      onClick={handleAiTextTool}
                      className="ai-tool-btn"
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        borderRadius: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      Summarize
                    </button>
                    <button
                      onClick={handleAiTextTool}
                      className="ai-tool-btn"
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Expand
                    </button>
                  </div>
                )}
              </div>

              <div className="toolbar-group ml-auto">
                <button
                  onClick={() => setShowBookmarkModal(true)}
                  className="btn-secondary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2 hidden md:flex"
                >
                  <Bookmark size={14} />
                  Bookmark
                </button>

                <div className="dropdown hidden md:block">
                  <button
                    onClick={() => setShowBookmarks(!showBookmarks)}
                    className="btn-secondary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
                  >
                    <BookOpen size={14} />
                    Page {currentPage}
                    <ChevronDown size={14} />
                  </button>

                  {showBookmarks && (
                    <div className="dropdown-menu rounded-xl border border-slate-200">
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
                                className="page-btn rounded-lg hover:bg-indigo-100 hover:text-indigo-900 transition-all duration-200"
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
                          <div
                            key={bookmark.id}
                            className="bookmark-item hover:bg-indigo-100 hover:text-indigo-900 transition-all duration-200"
                          >
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
                              className="remove-btn hover:bg-red-100 hover:text-red-900 transition-all duration-200"
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
                  className="btn-secondary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2 hidden md:flex"
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
                <span
                  id="word-count"
                  className="bg-slate-100 px-3 py-1 rounded-lg text-slate-700 font-medium"
                >
                  Words: {wordCount.toLocaleString()}
                </span>
                <span
                  id="page-count"
                  className="bg-slate-100 px-3 py-1 rounded-lg text-slate-700 font-medium"
                >
                  Pages: {pages.length}
                </span>
                <span
                  id="current-page"
                  className="bg-indigo-100 px-3 py-1 rounded-lg text-indigo-700 font-medium"
                >
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
                <div
                  id={`page-${index + 1}`}
                  className="page hover:shadow-lg transition-all duration-300"
                >
                  {/* Tiptap replaces contentEditable here */}
                  <PageEditor
                    page={page}
                    isPreviewMode={isPreviewMode}
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
                className="btn-secondary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
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
            <div className="modal rounded-2xl border border-slate-200 z-50">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Add Bookmark
              </h3>
              <input
                type="text"
                value={bookmarkName}
                onChange={(e) => setBookmarkName(e.target.value)}
                placeholder="Enter bookmark name..."
                className="modal-input rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && addBookmark()}
              />
              <div className="modal-actions">
                <button
                  onClick={() => setShowBookmarkModal(false)}
                  className="btn-secondary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={addBookmark}
                  className="btn-primary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
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
            <div
              className="ai-modal-override rounded-2xl border border-slate-200 z-50"
              style={{
                width: "90%",
                maxWidth: "900px",
                position: "fixed",
                top: "50%",
                left: "60%",
                transform: "translate(-50%, -50%)",
                margin: "0",
                padding: "24px",
                background: "white",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
                zIndex: "10001",
              }}
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                AI {aiTool} Result
              </h3>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <h4
                    style={{
                      marginBottom: "5px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Original Text:
                  </h4>
                  <div
                    style={{
                      padding: "15px",
                      backgroundColor: "#ffebee",
                      borderRadius: "12px",
                      color: "#d32f2f",
                      border: "1px solid #ffcdd2",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    {aiSelectedText}
                  </div>
                </div>
                <div>
                  <h4
                    style={{
                      marginBottom: "5px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    AI Result:
                  </h4>
                  <div
                    style={{
                      padding: "15px",
                      backgroundColor:
                        (aiResult && aiResult.includes("error")) ||
                        aiResult.includes("failed") ||
                        aiResult.includes("Please")
                          ? "#fef2f2"
                          : "#e3f2fd",
                      borderRadius: "12px",
                      color:
                        (aiResult && aiResult.includes("error")) ||
                        aiResult.includes("failed") ||
                        aiResult.includes("Please")
                          ? "#dc2626"
                          : "#1976d2",
                      minHeight: "120px",
                      overflow: "auto",
                      border:
                        (aiResult && aiResult.includes("error")) ||
                        aiResult.includes("failed") ||
                        aiResult.includes("Please")
                          ? "1px solid #fecaca"
                          : "1px solid #bbdefb",
                      fontSize: "14px",
                      lineHeight: "1.6",
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
                      <div>
                        {aiResult}
                        {(aiResult.includes("error") ||
                          aiResult.includes("failed") ||
                          aiResult.includes("Please")) && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">
                              💡 <strong>Tip:</strong> Try selecting a different
                              text passage or wait a moment before trying again.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      "No Suggestions Available"
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  onClick={handleKeepOriginal}
                  className="btn-secondary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
                >
                  Keep Original
                </button>
                <button
                  onClick={handleUseAiResult}
                  className="btn-primary bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
                  disabled={
                    isAiLoading ||
                    (aiResult &&
                      (aiResult.includes("error") ||
                        aiResult.includes("failed") ||
                        aiResult.includes("Please")))
                  }
                >
                  {isAiLoading ? "Processing..." : "Use Generated Suggestion"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Focus Mode Exit */}
        {isFocusMode && (
          <button
            onClick={() => setIsFocusMode(false)}
            className="focus-exit bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
          >
            Exit Focus Mode
          </button>
        )}
      </div>

      {/* Save to existing project */}
      {saveExistingBook && (
        <section className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-2xl bg-white ring-1 ring-slate-200">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Save To Existing Book Project
              </h3>
              <form
                onSubmit={handleSaveProject}
                className="mt-2 px-5 py-3"
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
                  className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        e.target.value !== "" ? Number(e.target.value) : null
                      );
                      setCreateNewDraft(false);
                      // Set flag to load draft content when user explicitly selects a draft
                      if (e.target.value !== "") {
                        shouldLoadDraftRef.current = true;
                      }
                    }
                  }}
                  className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">-- Select Existing Draft --</option>
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
                  className="mt-2 mb-4 px-3 py-1 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200"
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
                  className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>Draft</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <div className="flex justify-center px-4 pt-6 pb-1">
                  <Button className="btn-primary font-bold hover:bg-blue-300 bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    Confirm
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setSaveBook(false);
                      setSelectedDraftIndex(null);
                      setCreateNewDraft(false);
                    }}
                    className="btn-primary ml-4 bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
