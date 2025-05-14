"use client"

import { useState } from "react"
import { Users, Search, Edit, Trash2, UserPlus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card"
import PageHeader from "../components/PageHeader"
import "../style/Characters.css"

function Characters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  const characters = [
    {
      id: 1,
      name: "Lyra Nightshade",
      role: "Protagonist",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "A skilled relic hunter with a mysterious past. Lyra possesses an uncanny ability to sense ancient artifacts, a gift that has made her both valuable and hunted.",
      traits: ["Determined", "Resourceful", "Guarded"],
      background:
        "Orphaned at a young age, Lyra was raised by the Archivists, a secretive group dedicated to preserving knowledge from before the Cataclysm. Her unusual abilities manifested in her teens, setting her on a path that would eventually lead her to uncover the truth about her origins and the ancient civilization that once ruled their world.",
      timeline: [
        { year: "3042", event: "Born in Lower Eldoria" },
        { year: "3048", event: "Orphaned during the District Riots" },
        { year: "3049", event: "Taken in by the Archivists" },
        { year: "3060", event: "First manifestation of artifact-sensing abilities" },
        { year: "3065", event: "Began career as a relic hunter" },
        { year: "3070", event: "Present day - Discovers the truth about the Cataclysm" },
      ],
    },
    {
      id: 2,
      name: "Kaiden Vex",
      role: "Deuteragonist",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "A former Elite Guard from the Upper District who abandoned his post after discovering corruption within the ruling Council. Now works as a mercenary while secretly gathering evidence against the Council.",
      traits: ["Honorable", "Skilled fighter", "Strategic"],
      background:
        "Born to a prestigious family in the Upper District, Kaiden was groomed from childhood to join the Elite Guard. His exceptional combat abilities earned him a position protecting Council members, until he witnessed firsthand their misuse of ancient technology and exploitation of the lower districts.",
      timeline: [
        { year: "3045", event: "Born to the Vex family in Upper Eldoria" },
        { year: "3055", event: "Began training with the Elite Guard" },
        { year: "3063", event: "Appointed to the Council's personal guard" },
        { year: "3067", event: "Discovered Council's corruption and deserted" },
        { year: "3068", event: "Established network of informants across districts" },
        { year: "3070", event: "Present day - Allies with Lyra" },
      ],
    },
    {
      id: 3,
      name: "Thorne",
      role: "Antagonist",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "The enigmatic leader of the Shrouded Hand, a powerful organization that controls much of Eldoria's underground. Obsessed with acquiring ancient technology to consolidate power.",
      traits: ["Calculating", "Charismatic", "Ruthless"],
      background:
        "Little is known about Thorne's origins. Some say he emerged from the Wastes beyond the city walls, others believe he is a former Archivist who was corrupted by the knowledge he discovered. What's certain is his unparalleled understanding of pre-Cataclysm technology and his willingness to eliminate anyone who stands in his way.",
      timeline: [
        { year: "????", event: "Origins unknown" },
        { year: "3058", event: "First appearance in Eldoria" },
        { year: "3062", event: "Founded the Shrouded Hand" },
        { year: "3065", event: "Began systematic elimination of Archivists" },
        { year: "3068", event: "Acquired first major ancient artifact" },
        { year: "3070", event: "Present day - Hunting Lyra for her abilities" },
      ],
    },
    {
      id: 4,
      name: "Elara Dawnlight",
      role: "Supporting Character",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "The last high-ranking Archivist, keeper of the most dangerous knowledge from before the Cataclysm. Serves as Lyra's mentor and guide.",
      traits: ["Wise", "Protective", "Secretive"],
      background:
        "Elara has dedicated her life to preserving the knowledge of the past while ensuring the most dangerous secrets remain buried. She recognized Lyra's unique abilities early on and has guided her development, though she keeps many secrets even from her protégé.",
      timeline: [
        { year: "3020", event: "Born into the Archivist order" },
        { year: "3040", event: "Became youngest Master Archivist in history" },
        { year: "3048", event: "Rescued Lyra during the District Riots" },
        { year: "3055", event: "Discovered the Codex Terminus" },
        { year: "3060", event: "Began training Lyra to control her abilities" },
        { year: "3070", event: "Present day - Reveals partial truth about the Cataclysm" },
      ],
    },
    {
      id: 5,
      name: "Cyrus Blackwell",
      role: "Supporting Character",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "A brilliant engineer who specializes in reverse-engineering ancient technology. Provides Lyra with custom tools and weapons for her missions.",
      traits: ["Eccentric", "Genius", "Loyal"],
      background:
        "Cyrus was once employed by the Council to develop weapons based on ancient designs, but fled when he realized how his creations were being used against the lower districts. He now lives in a hidden workshop, trading his skills to those he trusts in exchange for rare components and protection.",
      timeline: [
        { year: "3040", event: "Born in Middle District" },
        { year: "3055", event: "Recruited by Council's technology division" },
        { year: "3062", event: "Created the first functioning energy weapon since the Cataclysm" },
        { year: "3064", event: "Escaped Council employment" },
        { year: "3066", event: "Established hidden workshop" },
        { year: "3068", event: "Began working with Lyra" },
      ],
    },
  ]

  const filteredCharacters = characters.filter(
    (character) =>
      character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="characters-page">
      <PageHeader
        title="Character Management"
        description="Create and manage your book's characters, their backgrounds, and relationships"
        icon={Users}
      />

      <div className="characters-actions">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search characters..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="add-character-button">
          <UserPlus className="button-icon" />
          <span>Add Character</span>
        </button>
      </div>

      <div className="characters-container">
        <div className="characters-list">
          <Card>
            <CardHeader>
              <CardTitle icon={Users}>Characters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="character-grid">
                {filteredCharacters.map((character) => (
                  <div
                    key={character.id}
                    className={`character-card ${selectedCharacter === character.id ? "selected" : ""}`}
                    onClick={() => setSelectedCharacter(character.id)}
                  >
                    <div className="character-image-container">
                      <img
                        src={character.image || "/placeholder.svg"}
                        alt={character.name}
                        className="character-image"
                      />
                      <div className="character-role">{character.role}</div>
                    </div>
                    <div className="character-info">
                      <h3 className="character-name">{character.name}</h3>
                      <p className="character-description">{character.description.substring(0, 100)}...</p>
                    </div>
                    <div className="character-actions">
                      <button className="character-action-button">
                        <Edit className="action-icon" />
                      </button>
                      <button className="character-action-button">
                        <Trash2 className="action-icon" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedCharacter && (
          <div className="character-details">
            <Card>
              <CardHeader>
                <CardTitle>Character Details</CardTitle>
              </CardHeader>
              <CardContent>
                {characters
                  .filter((c) => c.id === selectedCharacter)
                  .map((character) => (
                    <div key={character.id} className="character-profile">
                      <div className="profile-header">
                        <img
                          src={character.image || "/placeholder.svg"}
                          alt={character.name}
                          className="profile-image"
                        />
                        <div className="profile-title">
                          <h2 className="profile-name">{character.name}</h2>
                          <div className="profile-role">{character.role}</div>
                        </div>
                      </div>

                      <div className="profile-section">
                        <h3 className="section-title">Description</h3>
                        <p className="section-content">{character.description}</p>
                      </div>

                      <div className="profile-section">
                        <h3 className="section-title">Traits</h3>
                        <div className="character-traits">
                          {character.traits.map((trait, index) => (
                            <span key={index} className="character-trait">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="profile-section">
                        <h3 className="section-title">Background</h3>
                        <p className="section-content">{character.background}</p>
                      </div>

                      <div className="profile-section">
                        <h3 className="section-title">Timeline</h3>
                        <div className="character-timeline">
                          {character.timeline.map((event, index) => (
                            <div key={index} className="timeline-event">
                              <div className="timeline-year">{event.year}</div>
                              <div className="timeline-connector">
                                <div className="timeline-dot"></div>
                                {index < character.timeline.length - 1 && <div className="timeline-line"></div>}
                              </div>
                              <div className="timeline-description">{event.event}</div>
                            </div>
                          ))}
                        </div>
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

export default Characters
