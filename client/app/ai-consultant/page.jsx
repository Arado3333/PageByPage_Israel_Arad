"use client";

import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import "dotenv/config";
import {
  MessageSquare,
  RefreshCw,
  Copy,
  Sparkles,
  Zap,
  Wand2,
} from "lucide-react";
import StateButton from "../../components/StateButton";
import "../style/AIConsultant.css";
//import gemini api sdk
import { GoogleGenAI } from "@google/genai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageTransition from "../components/PageTransition";

export default function AIConsultantPage() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [{ text: "Ask me anything!" }],
    },
  ]);
  const [promptType, setPromptType] = useState("improve");
  const [isGenerating, setIsGenerating] = useState(false);
  const [geminiToken] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const ai = new GoogleGenAI({ apiKey: geminiToken });
  let sysPrompt =
    process.env.NEXT_PUBLIC_SYSTEM_PROMPT +
    ` current prompt type: ${promptType}`;

  function handleSendMessage() {
    if (inputText.trim() === "" && !media) return;

    setIsGenerating(true);
    // Create a new message with the current text
    setMessages([...messages, { role: "user", parts: [{ text: inputText }] }]);
  }

  async function sendToGemini() {
    try {
      let chat = ai.chats.create({
        model: "gemini-2.5-flash",
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
    } catch (error) {
      console.log(error);
    }
    setIsGenerating(false);
  }

  function copyToClipboard() {
    const text = document.querySelector(".ai-response").textContent;
    navigator.clipboard.writeText(text);
    toast("Text copied to clipboard");
  }

  useEffect(() => {
    if (messages[messages.length - 1].role === "user") {
      sendToGemini();
    }
  }, [messages]);

  return (
    <PageTransition>
      <div className="min-h-screen text-slate-800">
        {/* Decorative blobs */}
        <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-300 blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-30" />
        </div>

        <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] 3xl:max-w-[1920px] px-2 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-8 2xl:py-12 3xl:py-16 w-full">
          {/* Hero Section */}
          <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-4 sm:p-6 lg:p-8 2xl:p-12 3xl:p-16 mb-6 2xl:mb-8 3xl:mb-12 w-full relative overflow-hidden">
            {/* Decorative gradient header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-700 via-violet-700 to-pink-600"></div>

            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-3 py-1 text-sm 2xl:text-base 3xl:text-lg shadow-sm">
                <Sparkles className="w-4 h-4" />
                AI Assistant
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-serif text-[#0F1A2E] mb-2">
              AI Consultant
            </h1>
            <p className="text-base sm:text-lg 2xl:text-xl 3xl:text-2xl text-slate-600">
              Enhance your writing with AI-powered suggestions and improvements
            </p>
          </section>

          <div className="ai-container">
            <div className="ai-content">
              <div className="ai-input-card group rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Gradient header */}
                <div className="h-2 bg-gradient-to-r from-indigo-700 to-violet-700"></div>

                <div className="card-header">
                  <h2 className="card-title text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-slate-800">
                    <MessageSquare className="card-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7 text-indigo-600" />
                    Your Text
                  </h2>
                </div>
                <div className="card-content">
                  <div className="prompt-types">
                    <button
                      className={`prompt-type-button ${
                        promptType === "improve" ? "active" : ""
                      } bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2`}
                      onClick={() => setPromptType("improve")}
                    >
                      <Sparkles className="prompt-icon h-4 w-4 2xl:h-5 2xl:w-5 3xl:h-6 3xl:w-6" />
                      Improve
                    </button>
                    <button
                      className={`prompt-type-button ${
                        promptType === "summarize" ? "active" : ""
                      } bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2`}
                      onClick={() => setPromptType("summarize")}
                    >
                      <Zap className="prompt-icon h-4 w-4 2xl:h-5 2xl:w-5 3xl:h-6 3xl:w-6" />
                      Summarize
                    </button>
                    <button
                      className={`prompt-type-button ${
                        promptType === "expand" ? "active" : ""
                      } bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2`}
                      onClick={() => setPromptType("expand")}
                    >
                      <Wand2 className="prompt-icon h-4 w-4 2xl:h-5 2xl:w-5 3xl:h-6 3xl:w-6" />
                      Expand
                    </button>
                    <button
                      className={`prompt-type-button ${
                        promptType === "rewrite" ? "active" : ""
                      } bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2`}
                      onClick={() => setPromptType("rewrite")}
                    >
                      <RefreshCw className="prompt-icon h-4 w-4 2xl:h-5 2xl:w-5 3xl:h-6 3xl:w-6" />
                      Rewrite
                    </button>
                  </div>

                  <textarea
                    className="ai-textarea text-sm 2xl:text-base 3xl:text-lg rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  ></textarea>

                  <div className="ai-input-footer">
                    <div className="word-count text-sm 2xl:text-base 3xl:text-lg bg-slate-100 px-3 py-1 rounded-lg text-slate-700 font-medium">
                      {inputText.split(/\s+/).filter(Boolean).length} words
                    </div>

                    <StateButton
                      text={"Generate"}
                      state={isGenerating}
                      handlerFunction={handleSendMessage}
                      loadingText={"Generating..."}
                      disabled={!inputText.trim()}
                    />
                  </div>
                </div>
              </div>

              <div className="ai-output-card group rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Gradient header */}
                <div className="h-2 bg-gradient-to-r from-emerald-600 to-teal-600"></div>

                <div className="card-header">
                  <h2 className="card-title text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-slate-800">
                    <Sparkles className="card-icon h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7 text-emerald-600" />
                    AI Response
                  </h2>
                </div>
                <div className="card-content">
                  <div className="ai-response overflow-auto text-sm 2xl:text-base 3xl:text-lg rounded-xl border-slate-200">
                    {messages.map(
                      (message, index) =>
                        message.role === "model" && (
                          <div
                            key={index}
                            className="answer-bubble bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-4 text-slate-800 shadow-sm"
                          >
                            <Markdown>{message.parts[0].text}</Markdown>
                          </div>
                        )
                    )}
                  </div>

                  <div className="ai-output-footer">
                    <button
                      className="ai-button outline text-sm 2xl:text-base 3xl:text-lg bg-gradient-to-r from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2"
                      onClick={copyToClipboard}
                    >
                      <Copy className="button-icon h-4 w-4 2xl:h-5 2xl:w-5 3xl:h-6 3xl:w-6" />
                      Copy
                    </button>
                    <ToastContainer
                      pauseOnFocusLoss={false}
                      position="top-right"
                      pauseOnHover={false}
                      autoClose={3000}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
