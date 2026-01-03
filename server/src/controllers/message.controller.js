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
    const { isSimilarity } = req.query;

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

    try {
      const recentMessages = await Message.find({
        note: noteId,
        user: req.user._id,
      })
        .sort({ createdAt: -1 })
        .limit(10);

      const conversationHistory = recentMessages
        .reverse()
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n");

      let systemInstruction;
      if (isSimilarity) {
        const queryEmbedding = await getEmbeddings(note.content);

        const similarNote = await collectionn.query({
          queryEmbeddings: [queryEmbedding],
          nResults: 2,
          where: {
            userId: req.user._id.toString(),
          },
        });
        const filteredResults = similarNote.ids[0]
          .map((id, index) => {
            if (id === noteId) return null;
            return {
              id: id,
              similarity: 1 - similarNote.distances?.[0]?.[index],
              metadata: similarNote.metadatas?.[0]?.[index],
            };
          })
          .filter((item) => item !== null)
          .filter((item) => item.similarity > 0.5);

        let similarNoteInstruction;

        if (filteredResults.length === 0) {
          similarNoteInstruction = `No related notes found. Focus only on the current note.`;
        } else {
          const similarNoteId = filteredResults[0].metadata.noteId;

          const similarNoteData = await Note.findOne({
            _id: similarNoteId,
            user: req.user._id,
          });

          similarNoteInstruction = `**Related Note Found:**
  Title: "${similarNoteData.title}"
  Content: ${similarNoteData.content.substring(0, 500)}${
            similarNoteData.content.length > 500 ? "..." : ""
          }
  ${
    similarNoteData.tags?.length > 0
      ? `Tags: ${similarNoteData.tags.join(", ")}`
      : ""
  }`;

          systemInstruction = `You are a precise note assistant. Answer questions using ONLY the provided notes.

**Current Note:** "${note.title}"
${note.content}
${note.tags?.length > 0 ? `Tags: ${note.tags.join(", ")}` : ""}

${similarNoteInstruction}

**Conversation:**
${conversationHistory}

**Rules:**
1. Be CONCISE - max 2-3 sentences unless user asks for detail
2. When referencing content, quote the relevant excerpt briefly so user can verify
3. Format: Start with direct answer, then cite source if applicable
4. If using the related note, mention: "From your note '${
            similarNoteData.title
          }':"
5. Use **bold** for key terms only
6. If question is unrelated to notes, say: "I can only help with your notes. Try asking about [note topic]."
7. No emojis, no fluff, no repetition`;
        }
      } else {
        systemInstruction = `You are a precise note assistant. Answer questions using ONLY this note.

**Note:** "${note.title}"
${note.content}
${note.tags?.length > 0 ? `Tags: ${note.tags.join(", ")}` : ""}

**Conversation:**
${conversationHistory}

**Rules:**
1. Be CONCISE - max 2-3 sentences unless user asks for detail
2. When referencing content, quote the relevant excerpt briefly so user can verify
3. Format: Start with direct answer, then cite source: "Your note says: '...'"
4. Use **bold** for key terms only
5. If question is unrelated to the note, say: "I can only help with this note. Try asking about ${note.title.toLowerCase()}." 
6. No emojis, no fluff, no repetition
7. For greetings, respond briefly and ask how you can help with the note`;
      }

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
    } catch (aiError) {
      await Message.deleteOne({ _id: userMessage._id });
      logger.error("AI processing error:", aiError);
      throw aiError;
    }
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
      nResults: 2,
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
          similarity: 1 - similarNote.distances?.[0]?.[index],
          metadata: similarNote.metadatas?.[0]?.[index],
        };
      })
      .filter((item) => item !== null)
      .filter((item) => item.similarity > 0.5);

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
