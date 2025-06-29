"use client"

import { useEffect, useState } from "react"
import Markdown from "react-markdown";
import "dotenv/config";
import { MessageSquare, Send, RefreshCw, Copy, Sparkles, Zap, Wand2 } from "lucide-react"
import "../style/AIConsultant.css"
//import gemini api sdk
import { GoogleGenAI } from "@google/genai";
import { ToastContainer, toast } from 'react-toastify';

export default function AIConsultantPage() 
{
  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [{ text: "Ask me anything!" }],
    },
  ]);
  const [promptType, setPromptType] = useState("improve")
  const [isGenerating, setIsGenerating]   = useState(false)
  const [geminiToken] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY); //TODO - figure out the best way to pass auth token. current setup - via .env but gets hardcoded to the browser

  const ai = new GoogleGenAI({ apiKey: geminiToken });
  let sysPrompt = `You are in the role of an experienced book editor. you are multilingual, you can write in all kinds of languages, including hebrew. you know all of the dictation rules regarding to each language, and can give feedback on dictation mistakes or typos. Your job is to guide and tune or enhance the user's book text, so it will be correctly spelled and ready to be published. Any typo, grammar mistake, lack of vocabulary that the user's text has, output that in your answers, seperating between the refactored text and the original with the words 'Original Text'. Additional user instructions are in the message body. DO NOT break down the changes along with large explanations, just show both your version and the user's and tell really briefly what is the purpose of the changes. DO NOT use names from the text to personalise your answer's openings. possible prompt types: improve - analyze the text and give the user some ideas what they can write differently to make the text's subject more interesting. summarize - just make a summary of whatever text you get, in a story-like way that continues the writer's tone and language. expand - find subjects in the text that might need a bit of a stretch, in an interesting way. rewrite - offer some alternatives for the text written, relying on the main concept of the writer's original text. current prompt type: ${promptType}`;

  function handleSendMessage() {
    if (inputText.trim() === "" && !media) return;

    setIsGenerating(true);
    // Create a new message with the current text
    setMessages([...messages, { role: "user", parts: [{ text: inputText }] }]);
}

  async function sendToGemini()
  {
    try {
      let chat = ai.chats.create({
          model: "gemini-2.0-flash",
          history: messages.slice(1),
          config: {
              temperature: 0.5,
              maxOutputTokens: 1200,
              systemInstruction: sysPrompt,
          },
      });
      
      let response = await chat.sendMessage({
          message: inputText,
      });
      
      let result = response.candidates[0].content;
      
      setMessages([...messages, result]);
      setInputText("");
    }
    catch(error) {
      console.log(error);
    }
    setIsGenerating(false);

  }

  function copyToClipboard()
  {
    const text = document.querySelector(".ai-response").textContent;
    navigator.clipboard.writeText(text);
    toast("Text copied to clipboard");
  }

  useEffect(() => {
    if (messages[messages.length - 1].role === "user") {
      sendToGemini();
    }
  }, [messages])


  return (
    <div className="ai-container">
      <div className="ai-header">
        <h1 className="page-title">AI Consultant</h1>
      </div>

      <div className="ai-content">
        <div className="ai-input-card">
          <div className="card-header">
            <h2 className="card-title">
              <MessageSquare className="card-icon" />
              Your Text
            </h2>
          </div>
          <div className="card-content">
            <div className="prompt-types">
              <button
                className={`prompt-type-button ${promptType === "improve" ? "active" : ""}`}
                onClick={() => setPromptType("improve")}
              >
                <Sparkles className="prompt-icon" />
                Improve
              </button>
              <button
                className={`prompt-type-button ${promptType === "summarize" ? "active" : ""}`}
                onClick={() => setPromptType("summarize")}
              >
                <Zap className="prompt-icon" />
                Summarize
              </button>
              <button
                className={`prompt-type-button ${promptType === "expand" ? "active" : ""}`}
                onClick={() => setPromptType("expand")}
              >
                <Wand2 className="prompt-icon" />
                Expand
              </button>
              <button
                className={`prompt-type-button ${promptType === "rewrite" ? "active" : ""}`}
                onClick={() => setPromptType("rewrite")}
              >
                <RefreshCw className="prompt-icon" />
                Rewrite
              </button>
            </div>

            <textarea
              className="ai-textarea"
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>

            <div className="ai-input-footer">
              <div className="word-count">{inputText.split(/\s+/).filter(Boolean).length} words</div>

              <button className="ai-button primary" onClick={handleSendMessage} disabled={!inputText.trim() || isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="button-icon spinning" />
                    Generating... 
                  </>
                ) : (
                  <>
                    <Send className="button-icon" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="ai-output-card">
          <div className="card-header">
            <h2 className="card-title">
              <Sparkles className="card-icon" />
              AI Response
            </h2>
          </div>
          <div className="card-content">
            <div className="ai-response overflow-auto">{messages.map((message, index) => (
              message.role === "model" && <div key={index} className="answer-bubble">
                <Markdown>{message.parts[0].text}</Markdown>
                </div>
            ))}</div>

            <div className="ai-output-footer">
              <button className="ai-button outline" onClick={copyToClipboard}>
                <Copy className="button-icon" />
                Copy
              </button>
              <ToastContainer pauseOnFocusLoss={false} position="top-left" pauseOnHover={false} autoClose={3000}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}