import {
  archiveNote,
  createNote,
  deleteNote,
  getAllNotes,
  getAllTags,
  getNote,
  pinNote,
  updateNote,
} from "@/api/note.api";
import type {
  Note,
  NoteCreateData,
  NoteUpdateData,
  PaginationParams,
  PaginationResponse,
} from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface NoteStore {
  notes: Note[];
  pagination: PaginationResponse;
  isLoading: boolean;
  tags: string[];

  createNote: (data: NoteCreateData) => Promise<void>;
  fetchNotes: (params?: PaginationParams) => Promise<void>;
  fetchNoteById: (id: string) => Promise<Note>;
  updateNote: (id: string, data: NoteUpdateData) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  pinNote: (id: string) => Promise<void>;
  archiveNote: (id: string) => Promise<void>;
  fetchTags: () => Promise<void>;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  pagination: { total: 0, page: 1, limit: 10, pages: 0 },
  isLoading: false,
  tags: [],

  createNote: async (data) => {
    try {
      set({ isLoading: true });
      const response = await createNote(data);
      set((state) => ({
        notes: [response.note, ...state.notes],
        isLoading: false,
      }));
      toast.success(response.message || "Note created successfully.");
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.error || "Failed to create note.");
      throw error;
    }
  },

  fetchNotes: async (params?) => {
    try {
      set({ isLoading: true });
      const response = await getAllNotes(params);
      set({
        notes: response.notes,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.error || "Failed to fetch notes.");
      throw error;
    }
  },

  fetchNoteById: async (id) => {
    try {
      set({ isLoading: true });
      const response = await getNote(id);
      set({ isLoading: false });
      return response.note;
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.error || "Failed to fetch note.");
      throw error;
    }
  },

  updateNote: async (id, data) => {
    try {
      set({ isLoading: true });
      const response = await updateNote(id, data);
      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === id ? response.note : note
        ),
        isLoading: false,
      }));
      toast.success(response.message || "Note updated successfully.");
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.error || "Failed to update note.");
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      set({ isLoading: true });
      const response = await deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
        isLoading: false,
      }));
      toast.success(response.message || "Note deleted successfully.");
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.error || "Failed to delete note.");
      throw error;
    }
  },

  pinNote: async (id) => {
    try {
      set({ isLoading: true });
      const response = await pinNote(id);
      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === id ? response.note : note
        ),
        isLoading: false,
      }));
      toast.success(response.message || "Note pin status updated.");
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.error || "Failed to pin note.");
      throw error;
    }
  },

  archiveNote: async (id) => {
    try {
      set({ isLoading: true });
      const response = await archiveNote(id);
      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === id ? response.note : note
        ),
        isLoading: false,
      }));
      toast.success(response.message || "Note archive status updated.");
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.error || "Failed to archive note.");
      throw error;
    }
  },

  fetchTags: async () => {
    try {
      const response = await getAllTags();
      set({ tags: response.tags, isLoading: false });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch tags.");
      throw error;
    }
  },
}));
