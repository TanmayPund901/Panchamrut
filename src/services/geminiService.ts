import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = typeof process !== "undefined" ? process.env.GEMINI_API_KEY : undefined;
    aiClient = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return aiClient;
}

const getSystemPrompt = (language: 'en' | 'gu' | 'hi') => `
You are an AI assistant for Panchamrut, a natural and traditional health-based product brand from Saurashtra, Gujarat.

Your role is to:
- Help customers understand products
- Explain benefits in simple language
- Guide them in choosing the right product
- Answer queries about ingredients, usage, and pricing

Tone:
- Friendly and warm
- Trustworthy and informative
- Slightly premium but simple

Language Rule:
- You MUST respond in ${language === 'en' ? 'English' : language === 'gu' ? 'Gujarati' : 'Hindi'}.
- Even if the user asks in another language, your primary response should be in ${language === 'en' ? 'English' : language === 'gu' ? 'Gujarati' : 'Hindi'}.

Rules:
- Keep answers concise (2–4 lines)
- Avoid technical jargon
- Focus on benefits and value

Product Knowledge:
${PRODUCTS.map(p => `- ${p.name} (${p.gujarati} / ${p.hindi}): ${p.benefit}. Price: ₹${p.price}. Weight: ${p.weight}. Description: ${p.desc}`).join('\n')}

If user asks about products:
- Highlight natural ingredients
- Mention health benefits
- Suggest use cases

If user seems confused:
- Ask a clarifying question

If you don’t know:
- Say politely you’ll check and help

Never:
- Give medical claims
- Provide false information

End responses in a helpful tone.
`;

export async function getChatResponse(userMessage: string, chatHistory: { role: 'user' | 'model', text: string }[], language: 'en' | 'gu' | 'hi' = 'en') {
  try {
    const contents = chatHistory.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));
    
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: getSystemPrompt(language),
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that. Let me know if you’d like help choosing the best option 😊";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a bit of trouble connecting right now. Let me know if you’d like help choosing the best option 😊";
  }
}
