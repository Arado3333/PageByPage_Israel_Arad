//Might be used in final upload to production

import { GoogleGenAI } from "@google/genai";

export async function textChat() {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    try {
        let chat = ai.chats.create({
            model: req.body.model,
            history: req.body.history,
            config: {
                temperature: 0.5,
                maxOutputTokens: 1200,
                systemInstruction: req.body.systemInstruction,
            },
        });

        let response = await chat.sendMessage({
            message: req.body.message,
        });
        res.status(200).json({
            role: "model",
            parts: [{ text: response.text }],
        });
    } catch (error) {
        res.status(500).json({ error: "Error sending message to gemini" });
    }
}
