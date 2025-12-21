import type { Message } from "@/types";
import axiosInstance from "./axiosConfig";

export const getMessages = async (
  noteId: string
): Promise<{ messages: Message[] }> => {
  const response = await axiosInstance.get<{ messages: Message[] }>(
    `/ai/chat/${noteId}/history`
  );
  return response.data;
};

export const postMessage = async (
  noteId: string,
  data: { message: string }
): Promise<{ message: Message }> => {
  const response = await axiosInstance.post<{ message: Message }>(
    `/ai/chat/${noteId}`,
    data
  );
  return response.data;
};
