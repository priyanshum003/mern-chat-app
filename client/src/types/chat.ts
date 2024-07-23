import { User } from './auth';

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  chatName?: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage?: Message;
  groupAdmin?: User;
  groupAvatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatApiResponse {
  success: boolean;
  data: Chat | Chat[];
  message?: string;
}

export interface CreateChatResponse {
  success: boolean;
  data: Chat;
  message?: string;
}

export interface GetChatsResponse {
  success: boolean;
  data: Chat[];
  message?: string;
}