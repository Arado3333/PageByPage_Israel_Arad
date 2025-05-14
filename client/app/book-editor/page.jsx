"use client"

import { useState } from "react"
import {
  Save,
  Download,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  EyeOff,
} from "lucide-react"
import "../style/BookEditor.css"

export default function BookEditorPage() {
  const [activeTab, setActiveTab] = useState("editor")
  const [previewMode, setPreviewMode] = useState(false)

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h1 className="page-title">Book Editor</h1>

        <div className="editor-actions">
          <button className="editor-button outline">
            <Save className="button-icon" />
            Save
          </button>
          <button className="editor-button outline">
            <Download className="button-icon" />
            Export
          </button>
          <button className="editor-button primary" onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? (
              <>
                <EyeOff className="button-icon" />
                Edit Mode
              </>
            ) : (
              <>
                <Eye className="button-icon" />
                Preview
              </>
            )}
          </button>
        </div>
      </div>

      <div className="editor-card">
        {/* Editor Toolbar */}
        {!previewMode && (
          <div className="editor-toolbar">
            <button className="toolbar-button">
              <Undo className="toolbar-icon" />
            </button>
            <button className="toolbar-button">
              <Redo className="toolbar-icon" />
            </button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-button">
              <Bold className="toolbar-icon" />
            </button>
            <button className="toolbar-button">
              <Italic className="toolbar-icon" />
            </button>
            <button className="toolbar-button">
              <Underline className="toolbar-icon" />
            </button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-button">
              <List className="toolbar-icon" />
            </button>
            <button className="toolbar-button">
              <ListOrdered className="toolbar-icon" />
            </button>
            <div className="toolbar-divider"></div>
            <button className="toolbar-button">
              <AlignLeft className="toolbar-icon" />
            </button>
            <button className="toolbar-button">
              <AlignCenter className="toolbar-icon" />
            </button>
            <button className="toolbar-button">
              <AlignRight className="toolbar-icon" />
            </button>
          </div>
        )}

        {/* Editor Content */}
        <div className="editor-content">
          {previewMode ? (
            <div className="editor-preview"></div>
          ) : (
            <div className="editor-textarea-container">
              <textarea className="editor-textarea" placeholder="Start writing your book here..."></textarea>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
