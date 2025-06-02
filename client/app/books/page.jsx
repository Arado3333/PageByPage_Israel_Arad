"use client"

import { useState } from "react"
import BookLibrary from "../../app/books/book_components/book-library"
import BookWorkspace from "../../app/books/book_components/book-workspace"
import SectionEditor from "../../app/books/book_components/section-editor"
import NewProjectForm from "../../app/books/book_components/new-project-form"

// Real working data - not finished books
const initialBooks = [
  {
    id: 1,
    title: "The Digital Frontier",
    status: "Draft",
    lastEdited: "2024-01-15T10:30:00Z",
    tags: ["Fiction", "Sci-fi"],
    drafts: [
      {
        id: 1,
        title: "Opening scene",
        content:
          "The neon lights flickered against the rain-soaked streets, casting an ethereal glow on the empty sidewalks. Alex pulled the hood tighter, feeling the weight of the neural interface device in the backpack.",
        tag: "scene",
        status: "draft",
      },
      {
        id: 2,
        title: "Alex meets Sarah",
        content:
          "The coffee shop was nearly empty at 3 AM. Sarah looked up from her laptop, her eyes reflecting the blue glow of code. 'You're late,' she said without looking at Alex.",
        tag: "dialogue",
        status: "editing",
      },
      {
        id: 3,
        title: "Virtual world entry",
        content:
          "The headset activated with a soft hum. Reality dissolved into pixels, then reformed into something entirely new. Alex stood in a digital plaza that defied physics.",
        tag: "scene",
        status: "complete",
      },
      {
        id: 4,
        title: "Character backstory",
        content:
          "Alex grew up in the suburbs of Neo Tokyo, where holographic advertisements replaced billboards and AI assistants were as common as smartphones once were.",
        tag: "character",
        status: "draft",
      },
    ],
    notes: [
      {
        id: 1,
        title: "Plot outline",
        content:
          "Three act structure: Setup (Alex discovers the interface), Confrontation (entering the digital world), Resolution (choosing between realities). Key themes: identity, consciousness, what makes us human.",
        tag: "plot",
      },
      {
        id: 2,
        title: "Tech research",
        content:
          "VR technology capabilities in 2030: Full sensory immersion, direct neural interfaces, persistent virtual worlds. Current limitations: processing power, battery life, safety concerns.",
        tag: "research",
      },
      {
        id: 3,
        title: "Theme notes",
        content:
          "Central question: If we can create perfect digital selves, what happens to our physical identity? Explore the tension between virtual perfection and authentic humanity.",
        tag: "theme",
      },
    ],
    characters: [
      {
        id: 1,
        name: "Alex Chen",
        role: "Protagonist",
        notes:
          "Software engineer, 28, introverted but curious. Lost parents in tech accident, drives motivation to understand digital consciousness. Skilled coder but struggles with human connections.",
      },
      {
        id: 2,
        name: "Dr. Sarah Kim",
        role: "Mentor",
        notes:
          "AI researcher, 45, mysterious past with the technology. Former colleague of Alex's parents. Knows more about the interface than she reveals. Protective but secretive.",
      },
    ],
    assets: [
      {
        id: 1,
        name: "Cyberpunk city ref",
        type: "image",
        description: "Visual inspiration for Neo Tokyo - neon lights, vertical architecture, digital billboards",
      },
      {
        id: 2,
        name: "VR interface mockup",
        type: "sketch",
        description: "UI design for virtual world - minimalist, gesture-based, translucent elements",
      },
    ],
  },
  {
    id: 2,
    title: "Memoir: Growing Up Digital",
    status: "In Progress",
    lastEdited: "2024-01-10T14:20:00Z",
    tags: ["Memoir", "Personal"],
    drafts: [
      {
        id: 1,
        title: "First computer memory",
        content:
          "I was seven when Dad brought home our first computer. The beige tower hummed like a small refrigerator, and the monitor flickered with green text on a black screen.",
        tag: "memory",
        status: "complete",
      },
      {
        id: 2,
        title: "Internet discovery",
        content:
          "The dial-up sound was like a digital handshake with the future. Screeching, beeping, then silence - followed by the magic of connection to a world beyond our small town.",
        tag: "scene",
        status: "editing",
      },
    ],
    notes: [
      {
        id: 1,
        title: "Timeline",
        content:
          "1995-2024: Key tech milestones in my life. 1995: First computer, 1998: Internet, 2001: First cell phone, 2007: iPhone, 2010: Social media, 2020: Remote work, 2024: AI everywhere",
        tag: "structure",
      },
    ],
    characters: [],
    assets: [],
  },
]

export default function App() {
  const [currentView, setCurrentView] = useState("library")
  const [selectedBook, setSelectedBook] = useState(null)
  const [editingSection, setEditingSection] = useState(null)
  const [books, setBooks] = useState(initialBooks)
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)

  const handleOpenBook = (book) => {
    setSelectedBook(book)
    setCurrentView("workspace")
  }

  const handleEditSection = (section, type) => {
    setEditingSection({ ...section, type })
    setCurrentView("editor")
  }

  const handleUpdateBook = (updatedBook) => {
    setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)))
    setSelectedBook(updatedBook)
  }

  const handleBackToLibrary = () => {
    setCurrentView("library")
    setSelectedBook(null)
    setEditingSection(null)
  }

  const handleBackToWorkspace = () => {
    setCurrentView("workspace")
    setEditingSection(null)
  }

  const handleNewProject = () => {
    setShowNewProjectForm(true)
    setCurrentView("newProject")
  }

  const handleCreateProject = (projectData) => {
    const newBook = {
      id: Date.now(),
      title: projectData.title,
      status: "Draft",
      lastEdited: new Date().toISOString(),
      tags: projectData.tags || [],
      drafts: [],
      notes: [],
      characters: [],
      assets: [],
    }
    setBooks([...books, newBook])
    setCurrentView("library")
    setShowNewProjectForm(false)
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
          />
        )
      case "workspace":
        return (
          <BookWorkspace
            book={selectedBook}
            onBack={handleBackToLibrary}
            onEditSection={handleEditSection}
            onUpdateBook={handleUpdateBook}
          />
        )
      case "editor":
        return (
          <SectionEditor
            book={selectedBook}
            section={editingSection}
            onBack={handleBackToWorkspace}
            onSave={handleUpdateBook}
          />
        )
      case "newProject":
        return <NewProjectForm onCreateProject={handleCreateProject} onCancel={() => setCurrentView("library")} />
      default:
        return null
    }
  }

  return <div className="min-h-screen bg-background text-foreground">{renderCurrentView()}</div>
}
