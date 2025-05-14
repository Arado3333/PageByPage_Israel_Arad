"use client"

import { useState } from "react"
import { MessageSquare, Send, RefreshCw, Copy, ThumbsUp, ThumbsDown, Zap, Sparkles, Wand2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/Card"
import PageHeader from "../components/PageHeader"
import "../style/AIAssistant.css"

function AIAssistant() {
  const [inputText, setInputText] = useState("")
  const [promptType, setPromptType] = useState("improve")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = () => {
    if (!inputText.trim()) return

    setIsGenerating(true)

    // Simulate AI processing
    setTimeout(() => {
      let resultText = ""

      switch (promptType) {
        case "improve":
          resultText =
            "The ancient city of Eldoria stood as a testament to human resilience, its gleaming spires reaching toward the star-filled sky like defiant fingers. For most inhabitants, this night was merely another passage of time—ordinary lives unfolding beneath extraordinary architecture. But for Lyra Nightshade, the air carried a different weight, heavy with the promise of revelation.\n\nShe positioned herself at the edge of the Whispering Bridge, her midnight-blue cloak dancing with the cool night breeze. The structure—a marvel of pre-Cataclysm engineering—arced gracefully across the chasm that divided the opulent Upper District from the city's forgotten underbelly. Few dared cross after nightfall, but Lyra had long ago learned that opportunity often lurked where others feared to tread.\n\n'You're late,' a voice emerged from the shadows, its tone carrying equal measures of irritation and caution.\n\nLyra pivoted smoothly, her fingers instinctively finding the ornate hilt of her concealed dagger. The familiar weight against her palm provided comfort as she scanned the darkness. 'I came as soon as I received your message,' she replied, her voice betraying none of the tension coiling within her like a spring ready to release."
          break
        case "summarize":
          resultText =
            "Lyra Nightshade waits on the Whispering Bridge in Eldoria at night. The bridge connects the wealthy Upper District to the poorer areas of the city. Someone hidden in the shadows tells Lyra she's late, and she responds that she came as soon as she got their message. Lyra is cautious, keeping her hand on a concealed dagger while speaking to the mysterious figure."
          break
        case "expand":
          resultText =
            "The city of Eldoria glimmered under the pale moonlight, its towering spires reaching toward the star-filled sky. The ancient metropolis had been built upon the ruins of what once was, layers of civilization stacked like geological strata—pre-Cataclysm foundations supporting post-Cataclysm ambitions. Light from countless windows punctuated the darkness, each one representing lives untouched by the night's clandestine meeting.\n\nFor most of Eldoria's inhabitants, it was a night like any other—a tapestry of ordinary lives unfolding in the shadow of extraordinary architecture. Merchants counted their day's earnings, families gathered for evening meals, and guards patrolled their assigned routes with practiced indifference. But for Lyra Nightshade, this night marked the beginning of something unprecedented, a turning point she could feel in her bones.\n\nShe stood at the edge of the Whispering Bridge, her cloak of midnight blue billowing gently in the cool night breeze. The garment was practical rather than decorative, its many hidden pockets containing tools of her unusual trade. The ancient structure stretched before her, spanning the chasm that separated the affluent Upper District from the forgotten underbelly of the city. Its name came from the strange acoustic properties that allowed whispers to travel its length with perfect clarity while normal conversation dissipated into the void below.\n\nFew ventured across after nightfall, but Lyra wasn't concerned with common fears. She had traversed far more dangerous paths in her years as a relic hunter. The bridge's stone surface was worn smooth by centuries of foot traffic, and faint blue lines of energy pulsed along its edges—remnants of technology not fully understood but still functioning after all this time.\n\n'You're late,' a voice called from the shadows, the words carried by the bridge's unique properties so that they seemed to originate from just beside her ear.\n\nLyra turned with the fluid grace of someone accustomed to potential threats, her hand instinctively moving to the hilt of the dagger concealed beneath her cloak. The weapon was no ordinary blade but an artifact from before the Cataclysm, its edge never dulling and its material impervious to the passage of time. 'I came as soon as I received your message,' she replied, her voice steady despite the tension coiling within her. Her eyes, enhanced by years of working in darkness, scanned the shadows for the source of the voice."
          break
        case "rewrite":
          resultText =
            "Eldoria's spires pierced the night sky, glittering like frozen lightning against the darkness. The city hummed with ordinary lives, oblivious to the extraordinary events about to unfold. For Lyra Nightshade, however, this night pulsed with possibility.\n\nShe waited at the Whispering Bridge's edge, a sentinel in flowing darkness. The ancient span connected two worlds: the Upper District with its manicured wealth and the Lower District with its raw authenticity. Most citizens avoided crossing after sunset, their fears fed by superstition and practicality alike.\n\n'Punctuality isn't your strength,' came a voice from nowhere and everywhere.\n\nLyra's fingers found her hidden blade, muscle memory born from years of necessary caution. 'Your message found me when it found me,' she countered, voice level despite the adrenaline coursing through her veins."
          break
        default:
          resultText = "AI processing error. Please try again."
      }

      setResult({
        original: inputText,
        improved: resultText,
        type: promptType,
      })

      setIsGenerating(false)
    }, 2000)
  }

  const getPromptTypeLabel = (type) => {
    switch (type) {
      case "improve":
        return "Improve Writing"
      case "summarize":
        return "Summarize"
      case "expand":
        return "Expand Content"
      case "rewrite":
        return "Rewrite"
      default:
        return type
    }
  }

  return (
    <div className="ai-assistant-page">
      <PageHeader
        title="AI Writing Assistant"
        description="Get help with improving, summarizing, or transforming your writing"
        icon={MessageSquare}
      />

      <div className="ai-container">
        <div className="ai-input-section">
          <Card>
            <CardHeader>
              <CardTitle icon={MessageSquare}>Your Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prompt-types">
                <button
                  className={`prompt-type-button ${promptType === "improve" ? "active" : ""}`}
                  onClick={() => setPromptType("improve")}
                >
                  <Sparkles className="prompt-type-icon" />
                  <span>Improve</span>
                </button>
                <button
                  className={`prompt-type-button ${promptType === "summarize" ? "active" : ""}`}
                  onClick={() => setPromptType("summarize")}
                >
                  <Zap className="prompt-type-icon" />
                  <span>Summarize</span>
                </button>
                <button
                  className={`prompt-type-button ${promptType === "expand" ? "active" : ""}`}
                  onClick={() => setPromptType("expand")}
                >
                  <Wand2 className="prompt-type-icon" />
                  <span>Expand</span>
                </button>
                <button
                  className={`prompt-type-button ${promptType === "rewrite" ? "active" : ""}`}
                  onClick={() => setPromptType("rewrite")}
                >
                  <RefreshCw className="prompt-type-icon" />
                  <span>Rewrite</span>
                </button>
              </div>

              <textarea
                className="ai-textarea"
                placeholder="Enter your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              ></textarea>
            </CardContent>
            <CardFooter>
              <div className="ai-input-footer">
                <div className="ai-input-stats">
                  <span>{inputText.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <button
                  className="ai-submit-button"
                  onClick={handleSubmit}
                  disabled={!inputText.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="button-icon spinning" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="button-icon" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {result && (
          <div className="ai-output-section">
            <Card>
              <CardHeader>
                <CardTitle icon={MessageSquare}>{getPromptTypeLabel(result.type)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="ai-results">
                  <div className="ai-original-text">
                    <h3>Original Text</h3>
                    <p>{result.original}</p>
                  </div>
                  <div className="ai-improved-text">
                    <h3>Improved Text</h3>
                    <p>{result.improved}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="ai-output-footer">
                  <div className="ai-output-actions">
                    <button className="ai-action-button">
                      <ThumbsUp className="action-icon" />
                      <span>Good</span>
                    </button>
                    <button className="ai-action-button">
                      <ThumbsDown className="action-icon" />
                      <span>Bad</span>
                    </button>
                    <button className="ai-action-button">
                      <Copy className="action-icon" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIAssistant
