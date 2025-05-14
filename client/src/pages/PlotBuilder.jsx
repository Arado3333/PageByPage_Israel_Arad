"use client"

import { useState } from "react"
import { Map, Plus, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card"
import PageHeader from "../components/PageHeader"
import "../style/PlotBuilder.css"

function PlotBuilder() {
  const [viewMode, setViewMode] = useState("acts")

  return (
    <div className="plot-builder-page">
      <PageHeader title="Plot Builder" description="Structure your plot by acts, scenes, and key events" icon={Map} />

      <div className="plot-actions">
        <div className="view-selector">
          <button className={`view-button ${viewMode === "acts" ? "active" : ""}`} onClick={() => setViewMode("acts")}>
            Acts
          </button>
          <button
            className={`view-button ${viewMode === "chapters" ? "active" : ""}`}
            onClick={() => setViewMode("chapters")}
          >
            Chapters
          </button>
          <button
            className={`view-button ${viewMode === "scenes" ? "active" : ""}`}
            onClick={() => setViewMode("scenes")}
          >
            Scenes
          </button>
        </div>

        <button className="add-plot-button">
          <Plus className="button-icon" />
          <span>Add {viewMode === "acts" ? "Act" : viewMode === "chapters" ? "Chapter" : "Scene"}</span>
        </button>
      </div>

      <div className="plot-container">
        {viewMode === "acts" && (
          <div className="acts-view">
            <div className="act-column">
              <div className="act-header">
                <h3 className="act-title">Act I: Setup</h3>
                <div className="act-actions">
                  <button className="act-action-button">
                    <Edit className="action-icon" />
                  </button>
                  <button className="act-action-button">
                    <Plus className="action-icon" />
                  </button>
                </div>
              </div>

              <div className="plot-cards">
                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>Introduction to Eldoria</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    Establish the city of Eldoria, its districts, and the social divide. Introduce Lyra as she completes
                    a routine artifact retrieval.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 1-2</span>
                  </div>
                </div>

                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>The Mysterious Message</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    Lyra receives a cryptic message from a masked figure about a discovery that could change everything
                    they know about the Cataclysm.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 3</span>
                  </div>
                </div>

                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>Meeting Kaiden</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    Lyra encounters Kaiden Vex, a former Elite Guard, during a confrontation with Council agents.
                    Despite initial distrust, they form an uneasy alliance.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 4-5</span>
                  </div>
                </div>

                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>First Encounter with Thorne</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    Lyra and Kaiden's investigation leads them to a hidden archive, where they narrowly escape an ambush
                    by Thorne and his Shrouded Hand agents.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 6</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="act-column">
              <div className="act-header">
                <h3 className="act-title">Act II: Confrontation</h3>
                <div className="act-actions">
                  <button className="act-action-button">
                    <Edit className="action-icon" />
                  </button>
                  <button className="act-action-button">
                    <Plus className="action-icon" />
                  </button>
                </div>
              </div>

              <div className="plot-cards">
                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>Journey to the Wastes</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    Lyra and Kaiden venture beyond Eldoria's walls into the dangerous Wastes, seeking a rumored
                    pre-Cataclysm facility that may hold answers.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 7-8</span>
                  </div>
                </div>

                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>The Ancient Facility</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    They discover a partially intact research facility and activate an ancient AI that reveals the first
                    clues about the true nature of the Cataclysm.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 9-10</span>
                  </div>
                </div>

                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>Betrayal</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    Upon returning to Eldoria, they discover that someone close to Lyra has been feeding information to
                    Thorne. The Archivists' sanctuary is attacked.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 11-12</span>
                  </div>
                </div>

                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>Elara's Sacrifice</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    Elara sacrifices herself to protect Lyra and the Codex Terminus, but not before revealing that
                    Lyra's abilities are connected to pre-Cataclysm genetic engineering.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 13</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="act-column">
              <div className="act-header">
                <h3 className="act-title">Act III: Resolution</h3>
                <div className="act-actions">
                  <button className="act-action-button">
                    <Edit className="action-icon" />
                  </button>
                  <button className="act-action-button">
                    <Plus className="action-icon" />
                  </button>
                </div>
              </div>

              <div className="plot-cards">
                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>Uncovering the Truth</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    With Cyrus's help, Lyra decodes the Codex Terminus and learns that the Cataclysm was deliberately
                    triggered to prevent a worse catastrophe.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 14-15</span>
                  </div>
                </div>

                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>Confronting the Council</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    Lyra and Kaiden infiltrate the Council chambers to expose their collusion with Thorne and their
                    plans to use ancient technology to maintain control.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 16-17</span>
                  </div>
                </div>

                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>Final Showdown with Thorne</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    Thorne reveals his true identity and connection to Lyra before attempting to activate a dangerous
                    pre-Cataclysm weapon. Epic confrontation ensues.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 18-19</span>
                  </div>
                </div>

                <div className="plot-card">
                  <div className="plot-card-header">
                    <h4>New Beginning</h4>
                    <div className="plot-card-actions">
                      <button className="plot-card-action">
                        <Edit className="action-icon-small" />
                      </button>
                      <button className="plot-card-action">
                        <Trash2 className="action-icon-small" />
                      </button>
                    </div>
                  </div>
                  <p className="plot-card-description">
                    With Thorne defeated and the Council exposed, Lyra and Kaiden help establish a new order in Eldoria.
                    Lyra discovers there are others with abilities like hers, setting up potential sequel.
                  </p>
                  <div className="plot-card-meta">
                    <span className="plot-card-chapter">Chapter 20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "chapters" && (
          <div className="chapters-view">
            <Card>
              <CardHeader>
                <CardTitle icon={Map}>Chapter Outline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="chapter-list">
                  <div className="chapter-item expanded">
                    <div className="chapter-header">
                      <div className="chapter-number">Chapter 1</div>
                      <div className="chapter-title">The Beginning</div>
                      <div className="chapter-expand-button">
                        <ChevronUp className="expand-icon" />
                      </div>
                    </div>
                    <div className="chapter-content">
                      <div className="chapter-summary">
                        <h4>Summary</h4>
                        <p>
                          Introduction to Eldoria and Lyra Nightshade as she navigates the city's complex social
                          structure. Establishes her role as a relic hunter and her unique abilities.
                        </p>
                      </div>
                      <div className="chapter-details">
                        <div className="chapter-detail">
                          <h5>Key Events</h5>
                          <ul>
                            <li>Lyra completes a routine artifact retrieval in the Upper District</li>
                            <li>Demonstration of Lyra's artifact-sensing abilities</li>
                            <li>Introduction to the social divide between districts</li>
                            <li>Brief encounter with Council guards that establishes tension</li>
                          </ul>
                        </div>
                        <div className="chapter-detail">
                          <h5>Characters Introduced</h5>
                          <ul>
                            <li>Lyra Nightshade</li>
                            <li>Minor Council guards</li>
                            <li>Mention of Elara Dawnlight</li>
                          </ul>
                        </div>
                        <div className="chapter-detail">
                          <h5>Settings</h5>
                          <ul>
                            <li>Upper District of Eldoria</li>
                            <li>Whispering Bridge</li>
                            <li>Brief glimpse of Lower District</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="chapter-item">
                    <div className="chapter-header">
                      <div className="chapter-number">Chapter 2</div>
                      <div className="chapter-title">The Archivist's Warning</div>
                      <div className="chapter-expand-button">
                        <ChevronDown className="expand-icon" />
                      </div>
                    </div>
                  </div>

                  <div className="chapter-item">
                    <div className="chapter-header">
                      <div className="chapter-number">Chapter 3</div>
                      <div className="chapter-title">The Mysterious Message</div>
                      <div className="chapter-expand-button">
                        <ChevronDown className="expand-icon" />
                      </div>
                    </div>
                  </div>

                  <div className="chapter-item">
                    <div className="chapter-header">
                      <div className="chapter-number">Chapter 4</div>
                      <div className="chapter-title">Unexpected Ally</div>
                      <div className="chapter-expand-button">
                        <ChevronDown className="expand-icon" />
                      </div>
                    </div>
                  </div>

                  <div className="chapter-item">
                    <div className="chapter-header">
                      <div className="chapter-number">Chapter 5</div>
                      <div className="chapter-title">The Hidden Archive</div>
                      <div className="chapter-expand-button">
                        <ChevronDown className="expand-icon" />
                      </div>
                    </div>
                  </div>

                  <div className="chapter-item">
                    <div className="chapter-header">
                      <div className="chapter-number">Chapter 6</div>
                      <div className="chapter-title">Shadows in the Dark</div>
                      <div className="chapter-expand-button">
                        <ChevronDown className="expand-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {viewMode === "scenes" && (
          <div className="scenes-view">
            <div className="scene-board">
              <div className="scene-column">
                <div className="scene-column-header">
                  <h3>To Write</h3>
                  <span className="scene-count">4</span>
                </div>

                <div className="scene-cards">
                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Upper District Plaza</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">Council Announcement</h4>
                    <p className="scene-description">
                      The Council announces new restrictions on artifact trading, causing unrest among the crowd. Lyra
                      observes from the shadows.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 2</span>
                      <span className="scene-pov">Lyra</span>
                    </div>
                  </div>

                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Cyrus's Workshop</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">Weapon Upgrade</h4>
                    <p className="scene-description">
                      Cyrus upgrades Lyra's equipment with recovered tech. They discuss rumors about Council's recent
                      activities.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 4</span>
                      <span className="scene-pov">Lyra</span>
                    </div>
                  </div>

                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Abandoned Subway</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">Kaiden's Confession</h4>
                    <p className="scene-description">
                      Kaiden reveals his past connection to a Council member and why he's determined to expose their
                      corruption.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 5</span>
                      <span className="scene-pov">Kaiden</span>
                    </div>
                  </div>

                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">The Wastes</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">First Glimpse of Facility</h4>
                    <p className="scene-description">
                      Lyra and Kaiden get their first view of the ancient facility, surrounded by strange energy fields
                      and mutated wildlife.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 7</span>
                      <span className="scene-pov">Lyra</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="scene-column">
                <div className="scene-column-header">
                  <h3>In Progress</h3>
                  <span className="scene-count">3</span>
                </div>

                <div className="scene-cards">
                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Archivist Sanctuary</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">Elara's Revelation</h4>
                    <p className="scene-description">
                      Elara reveals partial truth about the Cataclysm and Lyra's connection to ancient genetic
                      experiments.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 8</span>
                      <span className="scene-pov">Lyra</span>
                    </div>
                  </div>

                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Ancient Facility</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">AI Activation</h4>
                    <p className="scene-description">
                      Lyra's abilities unexpectedly activate an ancient AI system that recognizes her genetic signature.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 9</span>
                      <span className="scene-pov">Lyra</span>
                    </div>
                  </div>

                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Lower District Hideout</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">Planning the Infiltration</h4>
                    <p className="scene-description">
                      Lyra, Kaiden, and Cyrus plan their infiltration of the Council chambers, testing new equipment.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 15</span>
                      <span className="scene-pov">Kaiden</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="scene-column">
                <div className="scene-column-header">
                  <h3>Completed</h3>
                  <span className="scene-count">5</span>
                </div>

                <div className="scene-cards">
                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Whispering Bridge</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">Midnight Meeting</h4>
                    <p className="scene-description">
                      Lyra meets the masked figure on the Whispering Bridge who delivers a cryptic message about the
                      Cataclysm.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 1</span>
                      <span className="scene-pov">Lyra</span>
                    </div>
                  </div>

                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Market District</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">Chase Scene</h4>
                    <p className="scene-description">
                      Lyra is pursued by Council guards through the crowded market after being recognized.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 2</span>
                      <span className="scene-pov">Lyra</span>
                    </div>
                  </div>

                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Abandoned Warehouse</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">First Meeting with Kaiden</h4>
                    <p className="scene-description">
                      Lyra's escape leads her to an abandoned warehouse where she encounters Kaiden fighting off Council
                      agents.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 3</span>
                      <span className="scene-pov">Lyra</span>
                    </div>
                  </div>

                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Shrouded Hand Hideout</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">Thorne's Plans</h4>
                    <p className="scene-description">
                      Scene from antagonist's perspective as Thorne discusses his plans for Lyra and the ancient
                      technology.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 4</span>
                      <span className="scene-pov">Thorne</span>
                    </div>
                  </div>

                  <div className="scene-card">
                    <div className="scene-card-header">
                      <span className="scene-location">Hidden Archive</span>
                      <div className="scene-card-actions">
                        <button className="scene-card-action">
                          <Edit className="action-icon-small" />
                        </button>
                      </div>
                    </div>
                    <h4 className="scene-title">Ambush</h4>
                    <p className="scene-description">
                      Lyra and Kaiden are ambushed by Thorne's agents while searching the hidden archive for
                      information.
                    </p>
                    <div className="scene-meta">
                      <span className="scene-chapter">Chapter 6</span>
                      <span className="scene-pov">Kaiden</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlotBuilder
