import fetch from "node-fetch";
import { AppError } from "./AppError.js"; // if you have a central error util

const HF_API_KEY = process.env.HF_API_KEY;
console.log(HF_API_KEY);

export const generateAIInsight = async (prompt) => {
  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: [
            {
              role: "system",
              content: "You are a financial assistant for invoices and clients. Provide concise, professional insights."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new AppError(`HF API request failed: ${errText}`, response.status);
    }

    const data = await response.json();

    // Handle OpenAI-compatible response format
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }

    if (data.error) {
      throw new AppError(`HF API error: ${data.error}`, 500);
    }

    return "⚠️ AI insight unavailable (unexpected response).";
  } catch (err) {
    console.error("Hugging Face Request Failed:", err);
    // Return a fallback message instead of throwing an error
    return "⚠️ AI insights temporarily unavailable due to service issues. Please try again later.";
  }
};