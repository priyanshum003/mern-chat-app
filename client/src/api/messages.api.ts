import { AxiosResponse } from 'axios';
import { GetMessagesResponse, SendMessageResponse } from '../types/message';
import axiosInstance from './axiosInstance';

export const sendMessage = async (content: string, chatId: string): Promise<SendMessageResponse> => {
  const response: AxiosResponse<SendMessageResponse> = await axiosInstance.post(`/messages`, { content, chatId });
  return response.data;
};

export const getMessages = async (chatId: string): Promise<GetMessagesResponse> => {
  const response: AxiosResponse<GetMessagesResponse> = await axiosInstance.get(`/messages/${chatId}`);
  return response.data;
};
