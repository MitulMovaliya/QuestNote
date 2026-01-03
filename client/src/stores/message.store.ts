import { getMessages, postMessage } from "@/api/message.api";
import type { Message } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MessageStore {
  currentNoteId?: string;
  messages: Message[];
  isLoading: boolean;
  fetchMessages: (noteId: string) => Promise<void>;
  sendMessage: (
    noteId: string,
    content: string,
    isSimilarity?: boolean
  ) => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  isLoading: false,

  fetchMessages: async (noteId) => {
    set({ isLoading: true });
    try {
      const response = await getMessages(noteId);
      set({
        messages: response.messages,
        currentNoteId: noteId,
      });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      set({ messages: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  sendMessage: async (noteId, content, isSimilarity) => {
    set({ isLoading: true });
    if (get().currentNoteId !== noteId) {
      await get().fetchMessages(noteId);
    }
    const snapShot = get().messages;
    try {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            role: "user",
            content,
          },
        ],
      }));
      const response = await postMessage(
        noteId,
        { message: content },
        { isSimilarity }
      );
      set((state) => ({
        messages: [...state.messages, response.message],
      }));
    } catch (error: any) {
      set({ messages: snapShot });
      toast.error(error.response?.data?.error || "Failed to send message");
    } finally {
      set({ isLoading: false });
    }
  },
}));
