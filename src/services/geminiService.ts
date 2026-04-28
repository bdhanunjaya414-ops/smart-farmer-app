import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const detectDisease = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64.split(",")[1] || imageBase64,
            },
          },
          {
            text: "Analyze this crop leaf image. Identify the plant and the disease if any. Provide the disease name, confidence level, and detailed treatment recommendations in JSON format.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plantName: { type: Type.STRING },
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["plantName", "diseaseName", "confidence", "recommendations"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const getExpertAdvice = async (query: string, history: any[] = []) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are an expert agricultural consultant. Provide practical, scientific, and easy-to-follow advice for farmers. Support multiple languages if asked.",
    },
  });

  const response = await chat.sendMessage({ message: query });
  return response.text;
};
