import { ai } from "../config/genai.js";

export const getEmbeddings = async (content) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [content],
  });
  const embeddings = response.embeddings[0].values;
  return embeddings;
};
