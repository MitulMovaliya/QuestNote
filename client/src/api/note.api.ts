import type {
  Note,
  NoteCreateData,
  NoteUpdateData,
  PaginationParams,
  PaginationResponse,
} from "@/types";
import axiosInstance from "./axiosConfig";

export const createNote = async (
  noteData: NoteCreateData
): Promise<{ message: string; note: Note }> => {
  const response = await axiosInstance.post("/notes", noteData);
  return response.data;
};

export const getAllNotes = async (
  params?: PaginationParams
): Promise<{
  notes: Note[];
  pagination: PaginationResponse;
}> => {
  const response = await axiosInstance.get<{
    notes: Note[];
    pagination: PaginationResponse;
  }>("/notes", { params });
  return response.data;
};

export const getNote = async (id: string): Promise<{ note: Note }> => {
  const response = await axiosInstance.get<{ note: Note }>(`/notes/${id}`);
  return response.data;
};

export const updateNote = async (
  id: string,
  noteData: Partial<NoteUpdateData>
): Promise<{ message: string; note: Note }> => {
  const response = await axiosInstance.put<{ message: string; note: Note }>(
    `/notes/${id}`,
    noteData
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(
    `/notes/${id}`
  );
  return response.data;
};

export const pinNote = async (
  id: string
): Promise<{ message: string; note: Note }> => {
  const response = await axiosInstance.patch<{ message: string; note: Note }>(
    `/notes/${id}/pin`
  );
  return response.data;
};

export const archiveNote = async (
  id: string
): Promise<{ message: string; note: Note }> => {
  const response = await axiosInstance.patch<{ message: string; note: Note }>(
    `/notes/${id}/archive`
  );
  return response.data;
};

export const getAllTags = async (): Promise<{ tags: string[] }> => {
  const response = await axiosInstance.get<{ tags: string[] }>("/notes/tags");
  return response.data;
};
