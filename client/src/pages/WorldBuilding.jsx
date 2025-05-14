"use client"

import { useState } from "react"
import { Globe, Search, Plus, Map, Building, Users, Leaf, Compass } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card"
import PageHeader from "../components/PageHeader"
import "../style/WorldBuilding.css"

function WorldBuilding() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)

  const worldItems = [
    {
      id: 1,
      name: "Eldoria",
      category: "locations",
      type: "City",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "The last major city-state in the known world, built upon the ruins of a pre-Cataclysm metropolis. Divided into distinct districts based on social hierarchy and function.",
      details:
        "Eldoria stands as a testament to humanity's resilience after the Cataclysm. Built upon the ruins of a pre-Cataclysm metropolis, it has evolved into a complex city-state with a population of approximately 500,000. The city is divided into three main districts: the Upper District, home to the Council and elite; the Middle District, where merchants and craftspeople reside; and the Lower District, housing the working class and those who cannot afford better. Beyond the city walls lie the Wastes, dangerous territories filled with mutated wildlife and the occasional ruins of ancient civilization.",
      tags: ["city", "main-setting", "post-apocalyptic"],
    },
    {
      id: 2,
      name: "The Cataclysm",
      category: "events",
      type: "Historical Event",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "The world-changing event that occurred approximately three centuries ago, destroying most of the advanced civilization that existed before and reshaping the planet's geography and ecosystems.",
      details:
        "The Cataclysm is the defining historical event in the world's timeline, occurring approximately three centuries before the story begins. Official records claim it was a natural disaster of unprecedented scale—a perfect storm of earthquakes, volcanic eruptions, and climate shifts that destroyed most of the advanced civilization that existed before. However, the truth (as discovered during the story) is that it was deliberately triggered by a group of scientists who discovered that the civilization's experimental technology was creating irreparable damage to the fabric of reality itself. The controlled Cataclysm was the lesser of two evils, designed to reset technological development and give the world a chance to recover. Most knowledge of pre-Cataclysm technology was lost, though fragments remain in the form of artifacts and ruins.",
      tags: ["apocalypse", "history", "central-mystery"],
    },
    {
      id: 3,
      name: "The Council",
      category: "factions",
      type: "Governing Body",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "The ruling body of Eldoria, composed of twelve members who represent different aspects of city governance. They maintain strict control over pre-Cataclysm artifacts and technology.",
      details:
        "The Council is the governing body of Eldoria, composed of twelve members who supposedly represent different aspects of city governance: Security, Resources, Knowledge, Infrastructure, Commerce, and Justice (with two members assigned to each). In reality, most Council members come from a small group of elite families who have maintained power since Eldoria's founding. The Council maintains strict control over pre-Cataclysm artifacts and technology, ostensibly to prevent another Cataclysm, but increasingly to maintain their own power. They employ the Elite Guard to enforce their edicts and have a complex relationship with the Archivists, whom they both rely upon and distrust.",
      tags: ["government", "antagonist", "elite"],
    },
    {
      id: 4,
      name: "The Archivists",
      category: "factions",
      type: "Knowledge Keepers",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "A secretive order dedicated to preserving knowledge from before the Cataclysm. They maintain extensive archives and train their members to memorize vast amounts of information.",
      details:
        "The Archivists are a secretive order dedicated to preserving knowledge from before the Cataclysm. Founded in the immediate aftermath of the world-changing event, they have maintained extensive archives and train their members to memorize vast amounts of information as a safeguard against physical destruction of their records. The Archivists operate from a hidden sanctuary beneath Eldoria, accessible only to initiated members. They have a complex relationship with the Council, officially serving as advisors on matters related to pre-Cataclysm artifacts and history, but secretly maintaining their own agenda and knowledge that they believe is too dangerous to share widely. The order has been in decline in recent decades, with their numbers dwindling and their influence waning as the Council has become more authoritarian.",
      tags: ["knowledge-keepers", "secret-society", "allies"],
    },
    {
      id: 5,
      name: "The Shrouded Hand",
      category: "factions",
      type: "Criminal Organization",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "A powerful criminal organization led by the enigmatic Thorne. They control much of Eldoria's underground economy and are particularly interested in acquiring pre-Cataclysm technology.",
      details:
        "The Shrouded Hand is a powerful criminal organization that controls much of Eldoria's underground economy. Led by the enigmatic Thorne, they have operatives throughout all districts of the city and even some infiltrators within the Council's administration. The organization is particularly interested in acquiring pre-Cataclysm technology, which they smuggle, study, and sell to the highest bidders. In recent years, the Shrouded Hand has shifted from purely profit-motivated activities to a more ideological pursuit, with Thorne becoming obsessed with certain types of ancient technology that could potentially shift the balance of power in Eldoria. Their symbol is a black hand with an eye in the palm, often left as a calling card at the scenes of their operations.",
      tags: ["criminals", "antagonists", "smugglers"],
    },
    {
      id: 6,
      name: "The Wastes",
      category: "locations",
      type: "Region",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "The dangerous territories beyond Eldoria's walls, filled with mutated wildlife, toxic zones, and the occasional ruins of ancient civilization.",
      details:
        "The Wastes encompass all territories beyond Eldoria's protective walls. Characterized by unpredictable weather patterns, mutated wildlife, and pockets of residual radiation or toxic chemicals, they are considered extremely dangerous by most city dwellers. Despite the hazards, the Wastes are home to scattered settlements of Outsiders who have adapted to the harsh conditions, as well as nomadic tribes who move between the more habitable areas. The Wastes also contain numerous ruins from before the Cataclysm, making them attractive to relic hunters like Lyra despite the dangers. Certain areas of the Wastes exhibit strange phenomena, such as electromagnetic anomalies, unexplained light displays, or localized weather that doesn't match the surrounding region—all suspected to be aftereffects of the Cataclysm or the result of damaged pre-Cataclysm technology still partially functioning.",
      tags: ["dangerous", "exploration", "ruins"],
    },
    {
      id: 7,
      name: "Artifact-Sensing",
      category: "concepts",
      type: "Ability",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "A rare ability possessed by Lyra that allows her to sense the presence and sometimes the function of pre-Cataclysm artifacts. Manifests as a tingling sensation and subtle visual aura only she can perceive.",
      details:
        "Artifact-Sensing is a rare ability possessed by Lyra and a handful of others in the world. It allows them to sense the presence and sometimes the function of pre-Cataclysm artifacts through a tingling sensation and subtle visual aura that only they can perceive. The ability manifests differently in each individual—Lyra experiences it as a blue-violet aura around artifacts, with different intensities and patterns indicating different types of technology. As revealed later in the story, this ability is not supernatural but the result of genetic modifications created before the Cataclysm, designed to help certain individuals interface with advanced technology. These genetic modifications have been passed down through specific bloodlines, becoming increasingly rare over the centuries. The ability can be enhanced through practice and exposure to artifacts, and in extreme cases, can allow the user to activate or control certain types of pre-Cataclysm technology that would otherwise remain dormant.",
      tags: ["special-ability", "technology", "genetic"],
    },
    {
      id: 8,
      name: "Whispering Bridge",
      category: "locations",
      type: "Structure",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "An ancient bridge connecting the Upper and Lower Districts of Eldoria. Named for the strange acoustic phenomenon that causes whispers to carry along its length.",
      details:
        "The Whispering Bridge is one of the few structures that survived the Cataclysm relatively intact. Spanning the deep chasm that now divides Eldoria, it connects the Upper and Lower Districts physically while symbolizing the social divide between them. The bridge is named for the strange acoustic phenomenon that causes whispers to carry along its length with perfect clarity, while louder sounds dissipate normally. This has made it a popular location for clandestine meetings, as conversations can be held privately even in plain sight, provided they are whispered. The bridge's architecture features elements not fully understood by modern builders, including self-repairing materials and subtle illumination that activates at night. Council guards patrol the bridge during daylight hours, but it is largely abandoned after dark, when most citizens avoid crossing due to superstition and practical safety concerns.",
      tags: ["landmark", "meeting-place", "ancient-technology"],
    },
    {
      id: 9,
      name: "The Codex Terminus",
      category: "items",
      type: "Artifact",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "A pre-Cataclysm data storage device containing crucial information about the true nature of the Cataclysm and the technology that led to it.",
      details:
        "The Codex Terminus is a pre-Cataclysm data storage device of unparalleled importance, containing crucial information about the true nature of the Cataclysm and the technology that led to it. Physically, it appears as a small crystalline cube with intricate circuitry visible within its translucent structure. The Codex has been in the Archivists' possession for centuries, but its contents have remained largely inaccessible due to incompatible modern technology and encryption. Only fragments have been decoded over the years, leading to the Archivists' partial understanding of the Cataclysm's true nature. The device responds uniquely to individuals with artifact-sensing abilities, making Lyra key to unlocking its full contents. The Codex is coveted by all factions in Eldoria, as it potentially contains not just historical truth but also the blueprints for recreating some of the most powerful pre-Cataclysm technologies.",
      tags: ["key-item", "ancient-technology", "plot-device"],
    },
  ]

  const filteredItems = worldItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category) => {
    switch (category) {
      case "locations":
        return <Map className="category-icon" />
      case "factions":
        return <Users className="category-icon" />
      case "events":
        return <Compass className="category-icon" />
      case "concepts":
        return <Leaf className="category-icon" />
      case "items":
        return <Building className="category-icon" />
      default:
        return <Globe className="category-icon" />
    }
  }

  return (
    <div className="world-building-page">
      <PageHeader
        title="World Building"
        description="Create and organize your fictional world's locations, cultures, and history"
        icon={Globe}
      />

      <div className="world-actions">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search world elements..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          <button
            className={`category-button ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            <Globe className="category-button-icon" />
            <span>All</span>
          </button>
          <button
            className={`category-button ${activeCategory === "locations" ? "active" : ""}`}
            onClick={() => setActiveCategory("locations")}
          >
            <Map className="category-button-icon" />
            <span>Locations</span>
          </button>
          <button
            className={`category-button ${activeCategory === "factions" ? "active" : ""}`}
            onClick={() => setActiveCategory("factions")}
          >
            <Users className="category-button-icon" />
            <span>Factions</span>
          </button>
          <button
            className={`category-button ${activeCategory === "events" ? "active" : ""}`}
            onClick={() => setActiveCategory("events")}
          >
            <Compass className="category-button-icon" />
            <span>Events</span>
          </button>
          <button
            className={`category-button ${activeCategory === "concepts" ? "active" : ""}`}
            onClick={() => setActiveCategory("concepts")}
          >
            <Leaf className="category-button-icon" />
            <span>Concepts</span>
          </button>
          <button
            className={`category-button ${activeCategory === "items" ? "active" : ""}`}
            onClick={() => setActiveCategory("items")}
          >
            <Building className="category-button-icon" />
            <span>Items</span>
          </button>
        </div>

        <button className="add-world-button">
          <Plus className="button-icon" />
          <span>Add Element</span>
        </button>
      </div>

      <div className="world-container">
        <div className="world-items-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`world-item-card ${selectedItem === item.id ? "selected" : ""}`}
              onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
            >
              <div className="world-item-image" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="world-item-category">
                  {getCategoryIcon(item.category)}
                  <span>{item.type}</span>
                </div>
              </div>
              <div className="world-item-content">
                <h3 className="world-item-name">{item.name}</h3>
                <p className="world-item-description">{item.description}</p>
                <div className="world-item-tags">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="world-item-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedItem && (
          <div className="world-item-details">
            <Card>
              <CardHeader>
                <CardTitle icon={getCategoryIcon(worldItems.find((i) => i.id === selectedItem).category)}>
                  {worldItems.find((i) => i.id === selectedItem).name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {worldItems
                  .filter((i) => i.id === selectedItem)
                  .map((item) => (
                    <div key={item.id} className="world-detail">
                      <div className="world-detail-header">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} className="world-detail-image" />
                        <div className="world-detail-meta">
                          <div className="world-detail-type">{item.type}</div>
                          <div className="world-detail-category">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="world-detail-section">
                        <h3 className="section-title">Description</h3>
                        <p className="section-content">{item.description}</p>
                      </div>

                      <div className="world-detail-section">
                        <h3 className="section-title">Details</h3>
                        <p className="section-content">{item.details}</p>
                      </div>

                      <div className="world-detail-section">
                        <h3 className="section-title">Tags</h3>
                        <div className="world-detail-tags">
                          {item.tags.map((tag, index) => (
                            <span key={index} className="world-detail-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="world-detail-section">
                        <h3 className="section-title">Related Elements</h3>
                        <div className="world-related-items">
                          {worldItems
                            .filter(
                              (relatedItem) =>
                                relatedItem.id !== item.id &&
                                (relatedItem.category === item.category ||
                                  relatedItem.tags.some((tag) => item.tags.includes(tag))),
                            )
                            .slice(0, 3)
                            .map((relatedItem) => (
                              <div
                                key={relatedItem.id}
                                className="world-related-item"
                                onClick={() => setSelectedItem(relatedItem.id)}
                              >
                                <div className="related-item-icon">{getCategoryIcon(relatedItem.category)}</div>
                                <div className="related-item-info">
                                  <div className="related-item-name">{relatedItem.name}</div>
                                  <div className="related-item-type">{relatedItem.type}</div>
                                </div>
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

export default WorldBuilding
