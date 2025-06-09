import { Sparkles, PenTool, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
// Import suggestions from AI Consultant or shared utility/hook
// import useAISuggestions from "../../app/ai-consultant/useAISuggestions"

export default function AISuggestionsCard() {
  // Replace with shared state/hook if available
  const dummySuggestions = [
    {
      id: 1,
      title: "Style improvement for Chapter 3",
      excerpt: "Consider varying sentence structure to improve flow...",
      timestamp: "1 day ago",
    },
    {
      id: 2,
      title: "Plot hole detected in Chapter 5",
      excerpt: "The character's motivation seems inconsistent with...",
      timestamp: "2 days ago",
    },
  ]

  return (
    <div className="dashboard-card ai-card">
      <div className="card-header">
        <h2 className="card-title">
          <Sparkles className="card-icon" />
          AI Suggestions
        </h2>
      </div>
      <div className="card-content">
        <ul className="suggestion-list">
          {dummySuggestions.map((suggestion) => (
            <li key={suggestion.id} className="suggestion-item">
              <div className="suggestion-icon">
                <PenTool />
              </div>
              <div className="suggestion-details">
                <h3 className="suggestion-title">{suggestion.title}</h3>
                <p className="suggestion-excerpt">{suggestion.excerpt}</p>
                <p className="suggestion-time">{suggestion.timestamp}</p>
              </div>
              <div className="suggestion-actions">
                <button className="action-button accept" aria-label="Accept suggestion">
                  <CheckCircle2 className="action-icon" />
                </button>
                <button className="action-button reject" aria-label="Reject suggestion">
                  <AlertCircle className="action-icon" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer">
        <Link href="/ai-consultant" className="card-link">
          Get more AI help <ChevronRight className="link-icon" />
        </Link>
      </div>
    </div>
  )
}
