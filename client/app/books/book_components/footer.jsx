"use client"

import { useState, useEffect } from "react"

export default function Footer() {
  const [sessionStats, setSessionStats] = useState({
    wordsToday: 0,
    timeWritten: 0,
  })
  const [quote, setQuote] = useState("The first draft of anything is shit. - Ernest Hemingway")
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simulate session tracking
    const interval = setInterval(() => {
      setSessionStats((prev) => ({
        ...prev,
        timeWritten: prev.timeWritten + 1,
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (!isVisible) return null

  return (
    <footer className="hidden md:block border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-6 text-muted-foreground">
            <span>Today: {sessionStats.wordsToday.toLocaleString()} words</span>
            <span>Session: {formatTime(sessionStats.timeWritten)}</span>
          </div>

          <div className="flex items-center gap-4">
            <blockquote className="italic text-muted-foreground max-w-md text-center">"{quote}"</blockquote>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Hide footer"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
