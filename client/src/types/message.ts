import { User } from "./auth";

export interface Message {
    _id: string;
    sender: User;
    content: string;
    chatId: string;
    createdAt: string;
    updatedAt: string;
}

export interface MessageApiResponse {
    success: boolean;
    data: Message | Message[];
    message?: string;
}

export interface SendMessageResponse {
    success: boolean;
    data: Message;
    message?: string;
}

export interface GetMessagesResponse {
    success: boolean;
    data: Message[];
    message?: string;
}