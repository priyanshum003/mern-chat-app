import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { createChat as createChatAPI, getChats as getChatsAPI } from '../api/chats.api';
import { getMessages as getMessagesAPI, sendMessage as sendMessageAPI } from '../api/messages.api';
import { Chat, Message } from '../types/chat';

interface ChatContextType {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  selectChat: (chat: Chat) => void;
  setSelectedChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => Promise<void>;
  fetchChats: () => Promise<void>;
  createChat: (params: { users: string[]; isGroupChat: boolean; chatName?: string; groupAdmin?: string }) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

let socket: Socket;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket.io server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      socket.emit('joinRoom', selectedChat._id);

      const handleMessage = (message: Message) => {
        setMessages((prevMessages) => {
          if (!prevMessages.some((m) => m._id === message._id)) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      };

      socket.on('message', handleMessage);

      return () => {
        socket.emit('leaveRoom', selectedChat._id);
        socket.off('message', handleMessage);
      };
    }
  }, [selectedChat]);

  const fetchChats = useCallback(async () => {
    const response = await getChatsAPI();
    if (response.success) {
      setChats(response.data);
    }
  }, []);

  const selectChat = useCallback(async (chat: Chat) => {
    setSelectedChat(chat);
    const response = await getMessagesAPI(chat._id);
    if (response.success) {
      setMessages(response.data);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!selectedChat) return;
    const response = await sendMessageAPI(content, selectedChat._id);
    if (response.success) {
      socket.emit('chatMessage', response.data);
    }
  }, [selectedChat]);

  const createChat = useCallback(async (params: { users: string[]; isGroupChat: boolean; chatName?: string; groupAdmin?: string }) => {
    const { users, isGroupChat, chatName, groupAdmin } = params;
    const response = await createChatAPI(users, isGroupChat, chatName, groupAdmin);
    if (response.success) {
      setChats((prevChats) => [...prevChats, response.data]);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <ChatContext.Provider value={{ chats, selectedChat, setSelectedChat, messages, selectChat, sendMessage, fetchChats, createChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
