import { CreateChatResponse, GetChatsResponse } from '../types/chat';
import axiosInstance from './axiosInstance';

export const createChat = async (users: string[], isGroupChat: boolean, chatName?: string, groupAdmin?: string):Promise <CreateChatResponse>  => {
  const response = await axiosInstance.post<CreateChatResponse>("/chats", { users, isGroupChat, chatName, groupAdmin });
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to create chat');
  }
  return response.data;
};

export const getChats = async (): Promise <GetChatsResponse> => {
  const response = await axiosInstance.get<GetChatsResponse>("/chats");
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch chats');
  }
  return response.data;
};
