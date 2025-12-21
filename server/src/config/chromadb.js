import { CloudClient } from "chromadb";

export const chromaClient = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

export const collectionn = await chromaClient.getOrCreateCollection({
  name: "note-embeddings",
});
