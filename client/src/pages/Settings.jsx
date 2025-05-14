"use client"

import { useState } from "react"
import { SettingsIcon, Save, Download, Moon, Sun, Monitor, Palette, FileText, Bell, User } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/Card"
import PageHeader from "../components/PageHeader"
import "../style/Settings.css"

function Settings() {
  const [theme, setTheme] = useState("dark")
  const [fontSize, setFontSize] = useState(16)
  const [lineSpacing, setLineSpacing] = useState(1.5)
  const [animations, setAnimations] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [autoSaveInterval, setAutoSaveInterval] = useState(5)
  const [exportFormat, setExportFormat] = useState("docx")

  return (
    <div className="settings-page">
      <PageHeader
        title="Settings"
        description="Configure your preferences and customize your writing environment"
        icon={SettingsIcon}
      />

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-nav">
            <a href="#appearance" className="settings-nav-item active">
              <Palette className="nav-icon" />
              <span>Appearance</span>
            </a>
            <a href="#editor" className="settings-nav-item">
              <FileText className="nav-icon" />
              <span>Editor</span>
            </a>
            <a href="#export" className="settings-nav-item">
              <Download className="nav-icon" />
              <span>Export</span>
            </a>
            <a href="#notifications" className="settings-nav-item">
              <Bell className="nav-icon" />
              <span>Notifications</span>
            </a>
            <a href="#account" className="settings-nav-item">
              <User className="nav-icon" />
              <span>Account</span>
            </a>
          </div>
        </div>

        <div className="settings-content">
          <section id="appearance" className="settings-section">
            <Card>
              <CardHeader>
                <CardTitle icon={Palette}>Appearance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="settings-group">
                  <label className="settings-label">Theme</label>
                  <div className="theme-options">
                    <button
                      className={`theme-option ${theme === "light" ? "active" : ""}`}
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="theme-icon" />
                      <span>Light</span>
                    </button>
                    <button
                      className={`theme-option ${theme === "dark" ? "active" : ""}`}
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="theme-icon" />
                      <span>Dark</span>
                    </button>
                    <button
                      className={`theme-option ${theme === "system" ? "active" : ""}`}
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="theme-icon" />
                      <span>System</span>
                    </button>
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Font Size</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
                      className="settings-slider"
                    />
                    <div className="slider-value">{fontSize}px</div>
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Line Spacing</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={lineSpacing}
                      onChange={(e) => setLineSpacing(Number.parseFloat(e.target.value))}
                      className="settings-slider"
                    />
                    <div className="slider-value">{lineSpacing}</div>
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Animations</label>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={animations} onChange={() => setAnimations(!animations)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <button className="settings-save-button">
                  <Save className="button-icon" />
                  <span>Save Changes</span>
                </button>
              </CardFooter>
            </Card>
          </section>

          <section id="editor" className="settings-section">
            <Card>
              <CardHeader>
                <CardTitle icon={FileText}>Editor Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="settings-group">
                  <label className="settings-label">Auto-Save</label>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={autoSave} onChange={() => setAutoSave(!autoSave)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {autoSave && (
                  <div className="settings-group">
                    <label className="settings-label">Auto-Save Interval</label>
                    <div className="select-container">
                      <select
                        value={autoSaveInterval}
                        onChange={(e) => setAutoSaveInterval(Number.parseInt(e.target.value))}
                        className="settings-select"
                      >
                        <option value="1">1 minute</option>
                        <option value="2">2 minutes</option>
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="settings-group">
                  <label className="settings-label">Spell Check</label>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={true} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Grammar Check</label>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={true} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Word Count Display</label>
                  <div className="radio-options">
                    <label className="radio-option">
                      <input type="radio" name="wordcount" value="always" checked={true} />
                      <span>Always show</span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="wordcount" value="hover" />
                      <span>Show on hover</span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="wordcount" value="hide" />
                      <span>Hide</span>
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <button className="settings-save-button">
                  <Save className="button-icon" />
                  <span>Save Changes</span>
                </button>
              </CardFooter>
            </Card>
          </section>

          <section id="export" className="settings-section">
            <Card>
              <CardHeader>
                <CardTitle icon={Download}>Export Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="settings-group">
                  <label className="settings-label">Default Export Format</label>
                  <div className="select-container">
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="settings-select"
                    >
                      <option value="docx">Microsoft Word (.docx)</option>
                      <option value="pdf">PDF Document (.pdf)</option>
                      <option value="epub">EPUB E-Book (.epub)</option>
                      <option value="txt">Plain Text (.txt)</option>
                      <option value="html">HTML Document (.html)</option>
                    </select>
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Include Metadata</label>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={true} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Include Comments</label>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={true} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Page Size</label>
                  <div className="select-container">
                    <select className="settings-select">
                      <option value="letter">Letter (8.5" x 11")</option>
                      <option value="a4">A4 (210mm x 297mm)</option>
                      <option value="a5">A5 (148mm x 210mm)</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <button className="settings-save-button">
                  <Save className="button-icon" />
                  <span>Save Changes</span>
                </button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Settings
