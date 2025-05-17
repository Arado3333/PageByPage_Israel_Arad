import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { text, promptType } = body;

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const sysPrompt = `
You are a multilingual expert book editor. Fix grammar, spelling, and phrasing.
Return:


Prompt type: ${promptType}. Be concise. No long explanations.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 1200 },
      systemInstruction: sysPrompt,
    });

    const generated = result.response.text();
    return NextResponse.json({ generated });
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
