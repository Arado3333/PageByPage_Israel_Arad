"use client"

import { useState, useRef, useEffect } from "react"
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
  Moon,
  Sun,
  Eye,
  Focus,
  Bookmark,
  X,
} from "lucide-react"
import '../../app//style/BookEditor.css'
export default function BookEditorPage() {
  const [pages, setPages] = useState([{ id: "1", content: "" }])
  const [bookmarks, setBookmarks] = useState([])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [wordCount, setWordCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [bookmarkName, setBookmarkName] = useState("")

  const containerRef = useRef(null)
  const activeEditorRef = useRef(null)

  // Calculate current page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop
        const pageHeight = 1200
        const newPage = Math.floor(scrollTop / pageHeight) + 1
        setCurrentPage(Math.min(newPage, pages.length))
      }
    }
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [pages.length])

  // Update word count
  useEffect(() => {
    const allContent = pages.map((page) => page.content).join(" ")
    const words = allContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
  }, [pages])

  const formatText = (command, value) => {
    if (isPreviewMode) return
    document.execCommand(command, false, value)
    if (activeEditorRef.current) activeEditorRef.current.focus()
  }

  const addNewPage = () => {
    setPages([...pages, { id: Date.now().toString(), content: "" }])
  }

  const updatePageContent = (pageId, content) => {
    setPages(pages.map((page) => (page.id === pageId ? { ...page, content } : page)))
  }

  const addBookmark = () => {
    if (bookmarkName.trim()) {
      const newBookmark = {
        id: Date.now().toString(),
        name: bookmarkName.trim(),
        pageNumber: currentPage,
        position: containerRef.current?.scrollTop || 0,
      }
      setBookmarks([...bookmarks, newBookmark])
      setBookmarkName("")
      setShowBookmarkModal(false)
    }
  }

  const scrollToBookmark = (bookmark) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: bookmark.position, behavior: "smooth" })
    }
    setShowBookmarks(false)
  }

  const removeBookmark = (bookmarkId) => {
    setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId))
  }

  const scrollToPage = (pageNumber) => {
    if (containerRef.current) {
      const pageHeight = 1200
      const targetPosition = (pageNumber - 1) * pageHeight
      containerRef.current.scrollTo({ top: targetPosition, behavior: "smooth" })
    }
    setShowBookmarks(false)
  }

  return (
    <div className={`book-editor ${isDarkMode ? "dark" : ""}`}>
      <div
        className="editor-container"
        style={{ backgroundColor: isDarkMode ? "#0a0a0a" : "#f8f9fa", color: isDarkMode ? "#ffffff" : "#0a0a0a" }}
      >
        {/* Toolbar */}
        {!isFocusMode && (
          <div
            className="toolbar"
            style={{
              backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
              borderBottom: `1px solid ${isDarkMode ? "#333" : "#e5e7eb"}`,
            }}
          >
            <div className="toolbar-content">
              <div className="toolbar-group">
                <button className="btn-primary">Save</button>
                <button className="btn-secondary" onClick={() => setIsPreviewMode(!isPreviewMode)}>
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
                      style={{
                        border: `1px solid ${isDarkMode ? "#444" : "#d1d5db"}`,
                        color: isDarkMode ? "#ffffff" : "#374151",
                      }}
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      className="toolbar-btn"
                      onClick={() => formatText("italic")}
                      style={{
                        border: `1px solid ${isDarkMode ? "#444" : "#d1d5db"}`,
                        color: isDarkMode ? "#ffffff" : "#374151",
                      }}
                    >
                      <Italic size={16} />
                    </button>
                    <button
                      className="toolbar-btn"
                      onClick={() => formatText("underline")}
                      style={{
                        border: `1px solid ${isDarkMode ? "#444" : "#d1d5db"}`,
                        color: isDarkMode ? "#ffffff" : "#374151",
                      }}
                    >
                      <Underline size={16} />
                    </button>
                  </div>

                  <div className="toolbar-group">
                    <select
                      onChange={(e) => formatText("formatBlock", e.target.value)}
                      className="toolbar-select"
                      style={{
                        backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                        color: isDarkMode ? "#ffffff" : "#0a0a0a",
                        border: `1px solid ${isDarkMode ? "#444" : "#d1d5db"}`,
                      }}
                    >
                      <option value="div">Normal</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                    </select>
                  </div>

                  <div className="toolbar-group">
                    <button
                      className="toolbar-btn"
                      onClick={() => formatText("justifyLeft")}
                      style={{
                        border: `1px solid ${isDarkMode ? "#444" : "#d1d5db"}`,
                        color: isDarkMode ? "#ffffff" : "#374151",
                      }}
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      className="toolbar-btn"
                      onClick={() => formatText("insertUnorderedList")}
                      style={{
                        border: `1px solid ${isDarkMode ? "#444" : "#d1d5db"}`,
                        color: isDarkMode ? "#ffffff" : "#374151",
                      }}
                    >
                      <List size={16} />
                    </button>
                    <button
                      className="toolbar-btn"
                      onClick={() => formatText("formatBlock", "blockquote")}
                      style={{
                        border: `1px solid ${isDarkMode ? "#444" : "#d1d5db"}`,
                        color: isDarkMode ? "#ffffff" : "#374151",
                      }}
                    >
                      <Quote size={16} />
                    </button>
                  </div>
                </>
              )}

              <div className="toolbar-group">
                <button
                  className="ai-btn"
                  style={{
                    backgroundColor: isDarkMode ? "#ffffff" : "#0a0a0a",
                    color: isDarkMode ? "#0a0a0a" : "#ffffff",
                  }}
                >
                  <Sparkles size={14} />
                  AI Tools
                </button>
              </div>

              <div className="toolbar-group ml-auto">
                <button
                  onClick={() => setShowBookmarkModal(true)}
                  className="btn-secondary"
                  style={{
                    backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f4f6",
                    color: isDarkMode ? "#ffffff" : "#374151",
                  }}
                >
                  <Bookmark size={14} />
                  Bookmark
                </button>

                <div className="dropdown">
                  <button
                    onClick={() => setShowBookmarks(!showBookmarks)}
                    className="btn-secondary"
                    style={{
                      backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f4f6",
                      color: isDarkMode ? "#ffffff" : "#374151",
                    }}
                  >
                    <BookOpen size={14} />
                    Page {currentPage}
                    <ChevronDown size={14} />
                  </button>

                  {showBookmarks && (
                    <div className="dropdown-menu" style={{ backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }}>
                      <div className="dropdown-header">Navigation</div>
                      <div className="dropdown-section">
                        <div className="page-buttons">
                          {Array.from({ length: pages.length }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => scrollToPage(i + 1)}
                              className="page-btn"
                              style={{
                                backgroundColor: currentPage === i + 1 ? "#D4AF37" : "transparent",
                                color: currentPage === i + 1 ? "white" : "inherit",
                              }}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bookmarks-list">
                        {bookmarks.map((bookmark) => (
                          <div key={bookmark.id} className="bookmark-item">
                            <button onClick={() => scrollToBookmark(bookmark)} className="bookmark-btn">
                              <BookOpen size={14} style={{ color: "#D4AF37" }} />
                              <div>
                                <div className="bookmark-name">{bookmark.name}</div>
                                <div className="bookmark-page">Page {bookmark.pageNumber}</div>
                              </div>
                            </button>
                            <button onClick={() => removeBookmark(bookmark.id)} className="remove-btn">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="btn-secondary"
                  style={{
                    backgroundColor: isDarkMode ? "#D4AF37" : "#f3f4f6",
                    color: isDarkMode ? "#0a0a0a" : "#374151",
                  }}
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                <button
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className="btn-secondary"
                  style={{
                    backgroundColor: isFocusMode ? "#D4AF37" : isDarkMode ? "#2a2a2a" : "#f3f4f6",
                    color: isFocusMode ? "#0a0a0a" : isDarkMode ? "#ffffff" : "#374151",
                  }}
                >
                  <Focus size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Bar */}
        {!isFocusMode && (
          <div
            className="status-bar"
            style={{
              backgroundColor: isDarkMode ? "#1a1a1a" : "#f8f9fa",
              borderBottom: `1px solid ${isDarkMode ? "#333" : "#e5e7eb"}`,
            }}
          >
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
        <div ref={containerRef} className="editor-area" style={{ backgroundColor: isDarkMode ? "#0a0a0a" : "#f1f3f4" }}>
          <div className="pages-container">
            {pages.map((page, index) => (
              <div key={page.id} className="page-wrapper">
                <div
                  className="page"
                  style={{
                    backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                    boxShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 4px 20px rgba(0, 0, 0, 0.1)",
                    color: isDarkMode ? "#ffffff" : "#0a0a0a",
                  }}
                >
                  <div
                    ref={index === 0 ? activeEditorRef : null}
                    contentEditable={!isPreviewMode}
                    suppressContentEditableWarning
                    className="page-content"
                    onInput={(e) => updatePageContent(page.id, e.currentTarget.textContent || "")}
                    placeholder={index === 0 ? "Start writing your story..." : ""}
                  />
                  <div className="page-number" style={{ color: isDarkMode ? "#888" : "#666" }}>
                    Page {index + 1}
                  </div>
                </div>
              </div>
            ))}

            <div className="add-page">
              <button
                onClick={addNewPage}
                className="btn-secondary"
                style={{
                  backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f4f6",
                  color: isDarkMode ? "#ffffff" : "#374151",
                }}
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
            <div
              className="modal"
              style={{ backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff", color: isDarkMode ? "#ffffff" : "#0a0a0a" }}
            >
              <h3>Add Bookmark</h3>
              <input
                type="text"
                value={bookmarkName}
                onChange={(e) => setBookmarkName(e.target.value)}
                placeholder="Enter bookmark name..."
                className="modal-input"
                style={{
                  backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                  color: isDarkMode ? "#ffffff" : "#0a0a0a",
                  border: `1px solid ${isDarkMode ? "#444" : "#d1d5db"}`,
                }}
                autoFocus
                onKeyPress={(e) => e.key === "Enter" && addBookmark()}
              />
              <div className="modal-actions">
                <button onClick={() => setShowBookmarkModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={addBookmark} className="btn-primary" disabled={!bookmarkName.trim()}>
                  Add
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
  )
}
