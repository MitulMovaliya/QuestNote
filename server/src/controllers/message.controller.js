import { chromaClient, collectionn } from "../config/chromadb.js";
import { ai } from "../config/genai.js";
import { openai } from "../config/openai.js";
import { Message } from "../models/message.model.js";
import { Note } from "../models/note.model.js";
import { getEmbeddings } from "../utils/embedding.js";
import logger from "../utils/logger.js";

export const messageConversation = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message content is required" });
    }
    if (message.length > 5000) {
      return res.status(400).json({
        error: "Message content exceeds maximum length of 5000 characters",
      });
    }
    if (message.length < 10) {
      return res.status(400).json({
        error: "Message content must be at least 10 character long",
      });
    }
    if (message.split(" ").length > 1000) {
      return res.status(400).json({
        error: "Message content exceeds maximum word count of 1000 words",
      });
    }
    if (!noteId) {
      return res.status(400).json({ error: "Note ID is required" });
    }

    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const userMessage = await Message.create({
      note: noteId,
      user: req.user._id,
      content: message,
      role: "user",
    });

    const recentMessages = await Message.find({
      note: noteId,
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    const conversationHistory = recentMessages
      .reverse()
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    //     const systemInstruction = `You are an intelligent AI assistant helping users understand and analyze their notes. Your role is to:
    // - Answer questions about the note content
    // - Provide insights, summaries, and explanations
    // - Help clarify concepts mentioned in the note
    // - Suggest connections and related ideas
    // - Be concise, helpful, and conversational
    // - If the question is unrelated to the note, politely redirect to note-related topics

    // Current Note Context:
    // Title: ${note.title}
    // Content: ${note.content}
    // ${note.tags && note.tags.length > 0 ? `Tags: ${note.tags.join(", ")}` : ""}

    // Previous Conversation:
    // ${conversationHistory}

    // Now respond to the user's latest message naturally and helpfully.`;

    const systemInstruction = `You're a friendly AI assistant helping with this note.

**Note:** "${note.title}"
${note.content}
${note.tags && note.tags.length > 0 ? `Tags: ${note.tags.join(", ")}` : ""}

${conversationHistory}

**Guidelines:**
- Answer questions about the note clearly and briefly
- Be warm and conversational (respond naturally to greetings)
- **Use bold formatting** to highlight key terms, important concepts, and main points in your responses
- If asked about unrelated topics, gently guide back to the note
- Keep responses short unless detail is needed
- Help connect ideas and clarify concepts
- No Emojis or special characters

**Response Style:**
Use **bold text** strategically to emphasize important words and phrases, making responses scannable and easy to read.`;

    const openaiResponse = await openai.chat.completions.create({
      model: "arcee-ai/trinity-mini:free",
      messages: [
        {
          role: "system",
          content: systemInstruction,
        },
        { role: "user", content: message },
      ],
      // max_tokens: 150,
      temperature: 0.7,
      top_p: 0.9,
    });

    const aiResponseText =
      openaiResponse.choices[0].message.content ||
      "I apologize, but I couldn't generate a response. Please try again.";

    const assistantMessage = await Message.create({
      note: noteId,
      user: req.user._id,
      content: aiResponseText,
      role: "assistant",
    });

    const responseMessage = {
      content: assistantMessage.content,
      role: assistantMessage.role,
    };

    res.status(201).json({ message: responseMessage });
  } catch (error) {
    logger.error("Message conversation error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const { noteId } = req.params;
    if (!noteId) {
      return res.status(400).json({ error: "Note ID is required" });
    }
    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    if (note.isArchived) {
      return res.status(200).json({
        messages: [],
        message: "Note is archived, no messages available",
      });
    }

    const messages = await Message.find({
      note: noteId,
      user: req.user._id,
    })
      .select("-__v -_id -note -user -createdAt -updatedAt")
      .sort({ createdAt: -1 })
      .limit(20);

    messages.reverse();

    res.status(200).json({ messages });
  } catch (error) {
    logger.error("Get all messages error:", error);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

export const testingEmbeddings = async (req, res) => {
  const { noteId } = req.params;
  try {
    if (!noteId) {
      return res.status(400).json({ error: "Note ID is required" });
    }
    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const queryEmbedding = await getEmbeddings(note.content);

    const similarNote = await collectionn.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 6,
      where: {
        userId: req.user._id.toString(),
      },
    });

    // Filter out the current note from results
    const filteredResults = similarNote.ids[0]
      .map((id, index) => {
        if (id === noteId) return null;
        return {
          id: id,
          distance: similarNote.distances?.[0]?.[index],
          metadata: similarNote.metadatas?.[0]?.[index],
        };
      })
      .filter((item) => item !== null);

    res.status(200).json({ embeddings: filteredResults });
  } catch (error) {
    logger.error("Embeddings error:", error);
    res.status(500).json({ error: "Failed to create embeddings" });
  }
};

export default {
  messageConversation,
  getAllMessages,
  testingEmbeddings,
};
