"use client"

import { useState } from "react"
import { Book, Plus, Search, Edit, Trash, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import "../style/Books.css"

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="books-container">
      <div className="books-header">
        <h1 className="page-title">My Books</h1>

        <button className="books-button primary">
          <Plus className="button-icon" />
          New Book
        </button>
      </div>

      <div className="search-card">
        <div className="search-form">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search books..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="search-filters">
            <select className="filter-select">
              <option value="all">All Books</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>

            <select className="filter-select">
              <option value="recent">Recently Updated</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="books-grid">
        {/* Empty book cards */}
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="book-card">
            <div className="book-header">
              <h3 className="book-title">
                <Book className="book-icon" />
              </h3>
              <button className="book-menu-button">
                <MoreHorizontal className="menu-icon" />
              </button>
            </div>
            <div className="book-content">
              <div className="book-details">
                <div className="book-meta"></div>
                <div className="book-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "0%" }}></div>
                  </div>
                  <span className="progress-text">0%</span>
                </div>
              </div>

              <div className="book-actions">
                <Link href="/book-editor" className="book-action-button edit">
                  <Edit className="action-icon" />
                  Edit
                </Link>
                <button className="book-action-button delete">
                  <Trash className="action-icon" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
