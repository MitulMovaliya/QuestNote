import { Note } from "../models/note.model.js";
import logger from "../utils/logger.js";

export const createNote = async (req, res) => {
  try {
    const { title, content, link, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const note = await Note.create({
      title,
      content,
      link,
      tags: tags || [],
      user: req.user._id,
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    logger.error("Create note error:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      tags,
      isPinned,
      isArchived,
    } = req.query;

    const filter = { user: req.user._id };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray };
    }

    if (isPinned !== undefined) {
      filter.isPinned = isPinned === "true";
    }

    if (isArchived !== undefined) {
      filter.isArchived = isArchived === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notes = await Note.find(filter)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Note.countDocuments(filter);

    res.status(200).json({
      notes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error("Get notes error:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ note });
  } catch (error) {
    logger.error("Get note error:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, link, tags, isPinned, isArchived } = req.body;

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (link !== undefined) note.link = link;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isArchived !== undefined) note.isArchived = isArchived;

    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    logger.error("Update note error:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    logger.error("Delete note error:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

export const togglePin = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({
      message: `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`,
      note,
    });
  } catch (error) {
    logger.error("Toggle pin error:", error);
    res.status(500).json({ error: "Failed to toggle pin" });
  }
};

export const toggleArchive = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({
      message: `Note ${
        note.isArchived ? "archived" : "unarchived"
      } successfully`,
      note,
    });
  } catch (error) {
    logger.error("Toggle archive error:", error);
    res.status(500).json({ error: "Failed to toggle archive" });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Note.distinct("tags", { user: req.user._id });

    res.status(200).json({ tags: tags.filter((tag) => tag) });
  } catch (error) {
    logger.error("Get tags error:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

export default {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePin,
  toggleArchive,
  getTags,
};
