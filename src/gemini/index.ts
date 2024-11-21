import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { IMessage } from "../store/chatSlice.ts";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  // model: "gemini-1.5-pro-002",
  // model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

async function runGemini(textInput: string, chatHistory?: IMessage[]) {
  console.log("textInput", textInput);
  const history = (chatHistory || []).map((item) => ({
    role: item.isBot ? "model" : "user",
    parts: [{ text: item.text }],
  }));
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: history,
  });

  const result = await chatSession.sendMessage(textInput);
  console.log(result.response.text());
  return result.response.text();
}

export default runGemini;
