export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isEmailVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  link: string;
  tags: string[];
  user: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteCreateData {
  title: string;
  content: string;
  link?: string;
  tags?: string[];
}

export interface NoteUpdateData {
  title?: string;
  content?: string;
  link?: string;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
  isPinned?: boolean;
  isArchived?: boolean;
}
