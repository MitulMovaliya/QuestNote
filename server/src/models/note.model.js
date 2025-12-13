import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      trim: true,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: (v) => /^[a-zA-Z0-9_-]+$/.test(v),
          message: "Tag must be one word with no spaces",
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for performance
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, isPinned: -1, createdAt: -1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ user: 1, tags: 1 });

export const Note = mongoose.model("Note", noteSchema);
