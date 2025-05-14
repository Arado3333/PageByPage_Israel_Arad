"use client"

import { useState } from "react"
import { FileText, Search, Calendar, Clock, ArrowLeft, ArrowRight, RefreshCw, RotateCcw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card"
import PageHeader from "../components/PageHeader"
import "../style/VersionHistory.css"

function VersionHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVersion, setSelectedVersion] = useState(null)

  const versions = [
    {
      id: 1,
      bookTitle: "The Dark Wanderer",
      chapter: "Chapter 3: The Revelation",
      date: "2025-04-08",
      time: "14:32:45",
      wordCount: 2450,
      changes: "+320 words",
      autoSaved: false,
      content:
        "The city of Eldoria glimmered under the pale moonlight, its towering spires reaching toward the star-filled sky. For most of its inhabitants, it was a night like any other—a tapestry of ordinary lives unfolding in the shadow of extraordinary architecture. But for Lyra Nightshade, this night marked the beginning of something unprecedented.\n\nShe stood at the edge of the Whispering Bridge, her cloak billowing gently in the cool night breeze. The ancient structure stretched before her, spanning the chasm that separated the affluent Upper District from the forgotten underbelly of the city. Few ventured across after nightfall, but Lyra wasn't concerned with common fears.\n\n'You're late,' a voice called from the shadows.\n\nLyra turned, her hand instinctively moving to the hilt of the dagger concealed beneath her cloak. 'I came as soon as I received your message,' she replied, her voice steady despite the tension coiling within her.",
    },
    {
      id: 2,
      bookTitle: "The Dark Wanderer",
      chapter: "Chapter 3: The Revelation",
      date: "2025-04-08",
      time: "11:15:22",
      wordCount: 2130,
      changes: "+150 words",
      autoSaved: true,
      content:
        "The city of Eldoria glimmered under the pale moonlight, its towering spires reaching toward the star-filled sky. For most of its inhabitants, it was a night like any other—a tapestry of ordinary lives unfolding in the shadow of extraordinary architecture. But for Lyra Nightshade, this night marked the beginning of something unprecedented.\n\nShe stood at the edge of the Whispering Bridge, her cloak billowing gently in the cool night breeze. The ancient structure stretched before her, spanning the chasm that separated the affluent Upper District from the forgotten underbelly of the city. Few ventured across after nightfall, but Lyra wasn't concerned with common fears.\n\n'You're late,' a voice called from the shadows.",
    },
    {
      id: 3,
      bookTitle: "The Dark Wanderer",
      chapter: "Chapter 3: The Revelation",
      date: "2025-04-07",
      time: "18:45:10",
      wordCount: 1980,
      changes: "+1980 words",
      autoSaved: false,
      content:
        "The city of Eldoria glimmered under the pale moonlight, its towering spires reaching toward the star-filled sky. For most of its inhabitants, it was a night like any other—a tapestry of ordinary lives unfolding in the shadow of extraordinary architecture. But for Lyra Nightshade, this night marked the beginning of something unprecedented.\n\nShe stood at the edge of the Whispering Bridge, her cloak billowing gently in the cool night breeze. The ancient structure stretched before her, spanning the chasm that separated the affluent Upper District from the forgotten underbelly of the city.",
    },
    {
      id: 4,
      bookTitle: "The Dark Wanderer",
      chapter: "Chapter 2: Unexpected Journey",
      date: "2025-04-06",
      time: "20:12:33",
      wordCount: 3240,
      changes: "-120 words",
      autoSaved: false,
      content:
        "Kaiden Vex moved through the crowded market with practiced ease, his hood pulled low over his face. The Elite Guard insignia that once adorned his uniform had been carefully removed, but the rigid posture and alert eyes remained—habits formed through years of training that were impossible to break.\n\nHe paused at a fruit vendor's stall, pretending to examine the wares while scanning the crowd. His contact was late, and in the Lower District, that usually meant trouble. As he waited, he observed the people around him—the tired faces, the worn clothing, the subtle signs of malnutrition that the Council pretended didn't exist in their perfect city.",
    },
    {
      id: 5,
      bookTitle: "The Dark Wanderer",
      chapter: "Chapter 2: Unexpected Journey",
      date: "2025-04-05",
      time: "15:30:18",
      wordCount: 3360,
      changes: "+220 words",
      autoSaved: true,
      content:
        "Kaiden Vex moved through the crowded market with practiced ease, his hood pulled low over his face. The Elite Guard insignia that once adorned his uniform had been carefully removed, but the rigid posture and alert eyes remained—habits formed through years of training that were impossible to break.\n\nHe paused at a fruit vendor's stall, pretending to examine the wares while scanning the crowd. His contact was late, and in the Lower District, that usually meant trouble. As he waited, he observed the people around him—the tired faces, the worn clothing, the subtle signs of malnutrition that the Council pretended didn't exist in their perfect city.\n\nA child bumped into him, small hands quickly patting his pockets before darting away. Kaiden allowed himself a small smile. The pickpocket would find nothing of value—he knew better than to carry anything important in accessible pockets. But the child's technique had been good, almost unnoticeable. In another life, he might have recruited such talent.",
    },
    {
      id: 6,
      bookTitle: "Chronicles of Light",
      chapter: "Chapter 1: The Beginning",
      date: "2025-04-04",
      time: "09:45:52",
      wordCount: 1850,
      changes: "+1850 words",
      autoSaved: false,
      content:
        "The first light of dawn crept over the horizon, painting the sky in hues of pink and gold. Elara watched from her tower window, savoring these quiet moments before the day began. As High Priestess of the Temple of Light, her days were filled with duties, rituals, and the endless stream of pilgrims seeking guidance or healing.\n\nBut something felt different today. The light seemed to shimmer with an unusual intensity, and the air held a charge that made her skin tingle. Elara had served the Light for over forty years, and she had learned to trust these subtle sensations—they were often harbingers of change.",
    },
  ]

  const filteredVersions = versions.filter(
    (version) =>
      version.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.chapter.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="version-history-page">
      <PageHeader
        title="Version History"
        description="Track changes, restore previous versions, and view your writing timeline"
        icon={FileText}
      />

      <div className="version-actions">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search versions..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="refresh-button">
          <RefreshCw className="button-icon" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="version-container">
        <div className="version-list">
          <Card>
            <CardHeader>
              <CardTitle icon={FileText}>Version Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="version-items">
                {filteredVersions.map((version) => (
                  <div
                    key={version.id}
                    className={`version-item ${selectedVersion === version.id ? "selected" : ""}`}
                    onClick={() => setSelectedVersion(version.id === selectedVersion ? null : version.id)}
                  >
                    <div className="version-meta">
                      <div className="version-book-title">{version.bookTitle}</div>
                      <div className="version-chapter">{version.chapter}</div>
                      <div className="version-datetime">
                        <div className="version-date">
                          <Calendar className="version-icon" />
                          <span>{version.date}</span>
                        </div>
                        <div className="version-time">
                          <Clock className="version-icon" />
                          <span>{version.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="version-stats">
                      <div className="version-wordcount">{version.wordCount} words</div>
                      <div className={`version-changes ${version.changes.startsWith("+") ? "positive" : "negative"}`}>
                        {version.changes}
                      </div>
                      {version.autoSaved && <div className="version-autosaved">Auto-saved</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedVersion && (
          <div className="version-preview">
            <Card>
              <CardHeader>
                <CardTitle>Version Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {versions
                  .filter((v) => v.id === selectedVersion)
                  .map((version) => (
                    <div key={version.id} className="version-content">
                      <div className="version-header">
                        <div className="version-title">
                          <h3>{version.bookTitle}</h3>
                          <h4>{version.chapter}</h4>
                        </div>
                        <div className="version-info">
                          <div className="version-date-time">
                            {version.date} at {version.time}
                          </div>
                          <div className="version-word-count">{version.wordCount} words</div>
                        </div>
                      </div>

                      <div className="version-text-preview">
                        <pre className="version-text">{version.content}</pre>
                      </div>

                      <div className="version-actions-footer">
                        <button className="version-action-button">
                          <ArrowLeft className="button-icon" />
                          <span>Previous Version</span>
                        </button>

                        <button className="version-restore-button">
                          <RotateCcw className="button-icon" />
                          <span>Restore This Version</span>
                        </button>

                        <button className="version-action-button">
                          <ArrowRight className="button-icon" />
                          <span>Next Version</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default VersionHistory
