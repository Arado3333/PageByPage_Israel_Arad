"use client"

import { useState } from "react"
import { HelpCircle, Search, BookOpen, MessageSquare, FileText, Info } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card"
import PageHeader from "../components/PageHeader"
import "../style/HelpCenter.css"

function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("faq")

  return (
    <div className="help-center-page">
      <PageHeader title="Help Center" description="Find answers, guides, and support resources" icon={HelpCircle} />

      <div className="help-search">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search for help topics..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="help-tabs">
        <button className={`help-tab ${activeTab === "faq" ? "active" : ""}`} onClick={() => setActiveTab("faq")}>
          <Info className="tab-icon" />
          <span>FAQ</span>
        </button>
        <button className={`help-tab ${activeTab === "guides" ? "active" : ""}`} onClick={() => setActiveTab("guides")}>
          <BookOpen className="tab-icon" />
          <span>User Guides</span>
        </button>
        <button
          className={`help-tab ${activeTab === "support" ? "active" : ""}`}
          onClick={() => setActiveTab("support")}
        >
          <MessageSquare className="tab-icon" />
          <span>Support</span>
        </button>
      </div>

      <div className="help-content">
        {activeTab === "faq" && (
          <Card>
            <CardHeader>
              <CardTitle icon={Info}>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="faq-list">
                <div className="faq-item">
                  <div className="faq-question">
                    <h3>How do I create a new book?</h3>
                    <button className="faq-toggle">+</button>
                  </div>
                  <div className="faq-answer">
                    <p>
                      To create a new book, go to the Home page and click on the "New Book" button in the Quick Actions
                      section. You'll be prompted to enter a title, genre, and optional description for your book. Once
                      created, you can start adding chapters and content right away.
                    </p>
                  </div>
                </div>

                <div className="faq-item">
                  <div className="faq-question">
                    <h3>How does the auto-save feature work?</h3>
                    <button className="faq-toggle">+</button>
                  </div>
                  <div className="faq-answer">
                    <p>
                      Writer's Nexus automatically saves your work as you write. By default, auto-save occurs every 5
                      minutes, but you can adjust this interval in the Settings page under the Editor section. You can
                      also manually save at any time by clicking the Save button in the editor. The auto-save feature
                      ensures you never lose your work, even if your browser crashes or you lose internet connection.
                    </p>
                  </div>
                </div>

                <div className="faq-item">
                  <div className="faq-question">
                    <h3>Can I export my book to different formats?</h3>
                    <button className="faq-toggle">+</button>
                  </div>
                  <div className="faq-answer">
                    <p>
                      Yes, Writer's Nexus supports exporting your work to multiple formats including DOCX, PDF, EPUB,
                      TXT, and HTML. To export your book, go to the Editor page and click on the Export button in the
                      top menu. You can configure your export preferences in the Settings page under the Export section,
                      where you can set your default format, page size, and whether to include metadata and comments.
                    </p>
                  </div>
                </div>

                <div className="faq-item">
                  <div className="faq-question">
                    <h3>How do I use the AI Assistant?</h3>
                    <button className="faq-toggle">+</button>
                  </div>
                  <div className="faq-answer">
                    <p>
                      The AI Assistant can help improve your writing in several ways. Navigate to the AI Assistant page,
                      paste the text you want to enhance, and select the type of assistance you need (improve,
                      summarize, expand, or rewrite). Click the "Generate" button and the AI will process your text. You
                      can then review the suggestions and copy the improved text back to your document. The AI Assistant
                      is particularly useful for overcoming writer's block, refining dialogue, or enhancing descriptive
                      passages.
                    </p>
                  </div>
                </div>

                <div className="faq-item">
                  <div className="faq-question">
                    <h3>How do I restore a previous version of my work?</h3>
                    <button className="faq-toggle">+</button>
                  </div>
                  <div className="faq-answer">
                    <p>
                      Writer's Nexus keeps track of all versions of your work. To restore a previous version, go to the
                      Version History page and browse through your saved versions. Click on any version to preview it,
                      and if you want to restore it, click the "Restore This Version" button. This will create a new
                      version with the restored content, preserving your version history. You can also compare different
                      versions to see what changes were made.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "guides" && (
          <Card>
            <CardHeader>
              <CardTitle icon={BookOpen}>User Guides & Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="guides-grid">
                <div className="guide-card">
                  <div className="guide-icon">
                    <BookOpen className="icon" />
                  </div>
                  <div className="guide-content">
                    <h3 className="guide-title">Getting Started Guide</h3>
                    <p className="guide-description">Learn the basics of navigating and using Writer's Nexus.</p>
                    <button className="guide-button">View Guide</button>
                  </div>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">
                    <FileText className="icon" />
                  </div>
                  <div className="guide-content">
                    <h3 className="guide-title">Editor Tutorial</h3>
                    <p className="guide-description">Master the powerful features of the Editor Console.</p>
                    <button className="guide-button">View Guide</button>
                  </div>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">
                    <MessageSquare className="icon" />
                  </div>
                  <div className="guide-content">
                    <h3 className="guide-title">AI Assistant Guide</h3>
                    <p className="guide-description">Learn how to use AI to enhance your writing effectively.</p>
                    <button className="guide-button">View Guide</button>
                  </div>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">
                    <HelpCircle className="icon" />
                  </div>
                  <div className="guide-content">
                    <h3 className="guide-title">Plot Builder Tutorial</h3>
                    <p className="guide-description">Structure your story with acts, chapters, and scenes.</p>
                    <button className="guide-button">View Guide</button>
                  </div>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">
                    <Info className="icon" />
                  </div>
                  <div className="guide-content">
                    <h3 className="guide-title">Character Development</h3>
                    <p className="guide-description">Create rich, complex characters for your stories.</p>
                    <button className="guide-button">View Guide</button>
                  </div>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">
                    <BookOpen className="icon" />
                  </div>
                  <div className="guide-content">
                    <h3 className="guide-title">World Building Guide</h3>
                    <p className="guide-description">Craft immersive settings and detailed worlds.</p>
                    <button className="guide-button">View Guide</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "support" && (
          <Card>
            <CardHeader>
              <CardTitle icon={MessageSquare}>Contact Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="support-container">
                <div className="contact-form">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input type="text" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-textarea" rows="6"></textarea>
                  </div>

                  <button className="support-submit-button">
                    <MessageSquare className="button-icon" />
                    <span>Send Message</span>
                  </button>
                </div>

                <div className="support-info">
                  <div className="support-card">
                    <h3 className="support-card-title">Response Time</h3>
                    <p className="support-card-content">
                      We typically respond to all support inquiries within 24 hours during business days.
                    </p>
                  </div>

                  <div className="support-card">
                    <h3 className="support-card-title">Live Chat</h3>
                    <p className="support-card-content">
                      Need immediate assistance? Our live chat support is available Monday-Friday, 9am-5pm EST.
                    </p>
                    <button className="support-chat-button">Start Chat</button>
                  </div>

                  <div className="support-card">
                    <h3 className="support-card-title">Knowledge Base</h3>
                    <p className="support-card-content">
                      Browse our extensive knowledge base for quick answers to common questions.
                    </p>
                    <button className="support-kb-button">Browse Articles</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default HelpCenter
