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
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
        )
        .join("\n");

      const shouldUseSimilarity =
        isSimilarity === true ||
        isSimilarity === "true" ||
        isSimilarity === "1";

      const currentNoteContent = String(note.content || "").substring(0, 4000);

      let systemInstruction;
      if (shouldUseSimilarity) {
        // Embed the current note's content to find similar notes.
        const queryEmbedding = await getEmbeddings(currentNoteContent);

        const similarNote = await collectionn.query({
          queryEmbeddings: [queryEmbedding],
          nResults: 5,
          where: {
            userId: req.user._id.toString(),
          },
        });

        const resultIds = similarNote?.ids?.[0] || [];
        const filteredResults = resultIds
          .map((id, index) => {
            if (id === noteId) return null;
            return {
              id,
              similarity: 1 - (similarNote?.distances?.[0]?.[index] ?? 1),
              metadata: similarNote?.metadatas?.[0]?.[index],
            };
          })
          .filter((item) => item !== null)
          .filter((item) => item.similarity > 0.35);

        let similarNoteInstruction =
          "No related notes found. Focus only on the current note.";
        let relatedNoteTitle = null;

        const topRelated = filteredResults[0];
        const similarNoteId = topRelated?.metadata?.noteId;

        if (similarNoteId) {
          const similarNoteData = await Note.findOne({
            _id: similarNoteId,
            user: req.user._id,
          });

          if (similarNoteData) {
            relatedNoteTitle = similarNoteData.title;
            similarNoteInstruction = `**Related Note Found:**
Title: "${similarNoteData.title}"
Content: ${similarNoteData.content.substring(0, 1200)}${
              similarNoteData.content.length > 1200 ? "..." : ""
            }
${
  similarNoteData.tags?.length > 0
    ? `Tags: ${similarNoteData.tags.join(", ")}`
    : ""
}`;
          }
        }

        systemInstruction = `Answer only from provided notes. If unable: "I can only answer using your notes. I could not find that in this note context."

Note: "${note.title}"
${currentNoteContent}
${note.tags?.length > 0 ? `Tags: ${note.tags.join(", ")}` : ""}

${similarNoteInstruction}

Conversation:
${conversationHistory}

1. Be concise (max 2-4 sentences)
2. Only use text from notes, no invention
3. Include short evidence quote for factual questions
4. If using related note: "From your note '${
          relatedNoteTitle || "related note"
        }':"
5. For unrelated questions: redirect to note
6. No emojis/fluff/repetition`;
      } else {
        systemInstruction = `Answer only from this note. If unable: "I can only answer using your note. I could not find that in this note."

Note: "${note.title}"
${currentNoteContent}
${note.tags?.length > 0 ? `Tags: ${note.tags.join(", ")}` : ""}

Conversation:
${conversationHistory}

1. Be concise (max 2-4 sentences)
2. Only use text from note, no invention
3. Include short evidence quote for factual questions
4. For unrelated: "I can only help with this note. Ask about ${note.title.toLowerCase()}."
5. For greetings: respond briefly and offer help
6. No emojis/fluff/repetition`;
      }

      console.log(systemInstruction);

      const modelName =
        process.env.OPENROUTER_MODEL?.trim() ||
        "arcee-ai/trinity-large-preview:free";

      const openaiResponse = await openai.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: "system",
            content: systemInstruction,
          },
          { role: "user", content: message },
        ],
        max_tokens: 220,
        temperature: 0.2,
        top_p: 0.8,
      });

      const aiResponseText =
        openaiResponse?.choices?.[0]?.message?.content?.trim() ||
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
