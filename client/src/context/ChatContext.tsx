import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { createChat as createChatAPI, getChats as getChatsAPI } from '../api/chats.api';
import { getMessages as getMessagesAPI, sendMessage as sendMessageAPI } from '../api/messages.api';
import { Chat, Message } from '../types/chat';
import { useAuth } from './AuthContext';

const socketURL = import.meta.env.VITE_SOCKET_URL as string;

interface ChatContextType {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  selectChat: (chat: Chat) => void;
  setSelectedChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => Promise<void>;
  fetchChats: () => Promise<void>;
  createChat: (params: { users: string[]; isGroupChat: boolean; chatName?: string; groupAdmin?: string }) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  onlineUsers: { [userId: string]: string };
  typingUsers: { [chatId: string]: string[] };
  unreadMessages: { [chatId: string]: number };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

let socket: Socket;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [chatId: string]: string[] }>({});
  const [onlineUsers, setOnlineUsers] = useState<{ [userId: string]: string }>({});
  const [unreadMessages, setUnreadMessages] = useState<{ [chatId: string]: number }>({});

  const { user: currentUser } = useAuth();

  const updateLatestMessageInChat = useCallback((message: Message) => {
    console.log('Updating latest message in chat:', message); // Debugging
    setChats((prevChats) =>
      prevChats
        .map((chat) =>
          chat._id === message.chatId
            ? { ...chat, latestMessage: message }
            : chat
        )
        .sort((a, b) => new Date(b.latestMessage?.createdAt || 0).getTime() - new Date(a.latestMessage?.createdAt || 0).getTime())
    );
  }, []);

  useEffect(() => {
    console.log("Unread messages updated:", unreadMessages);
  }, [unreadMessages]);
  
  const incrementUnreadMessages = useCallback((chatId: string) => {
    setUnreadMessages((prevUnread) => {
      console.log("Incrementing unread messages for chatId:", chatId); // Debugging
      console.log("Previous unread messages state:", prevUnread); // Debugging
      return {
        ...prevUnread,
        [chatId]: (prevUnread[chatId] || 0) + 1,
      };
    });
  }, []);
  

  const clearUnreadMessages = useCallback((chatId: string) => {
    setUnreadMessages((prevUnread) => ({
      ...prevUnread,
      [chatId]: 0,
    }));
  }, []);

  useEffect(() => {
    socket = io(socketURL);
  
    socket.on('connect', () => {
      console.log('Connected to socket.io server');
      if (currentUser) {
        socket.emit('userConnected', currentUser?._id);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from socket.io server');
    });
  
    socket.on('updateUserStatus', ({ userId, status }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: status,
      }));
    });
  
    socket.on('typingStatus', ({ chatId, typingUsers }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [chatId]: typingUsers.filter((id: string) => id !== currentUser?._id),
      }));
    });
  
    socket.on('newMessageNotification', (message: Message) => {
      console.log('New message received:', message);
      if (!selectedChat || selectedChat._id !== message.chatId) {
        incrementUnreadMessages(message.chatId);
      }
      updateLatestMessageInChat(message);
    });
  
    socket.on('latestMessage', (message: Message) => {
      updateLatestMessageInChat(message);
    });
  
    socket.on('newChatNotification', (chat: Chat) => {
      console.log('New chat created:', chat);
      setChats((prevChats) => [...prevChats, chat]);
    
      if (currentUser && chat.users.some(user => user._id === currentUser._id)) {
        incrementUnreadMessages(chat._id);
      }
    });
  
    socket.on('unreadCountUpdate', ({ chatId, count }) => {
      setUnreadMessages(prev => ({
        ...prev,
        [chatId]: count
      }));
    });
  
    return () => {
      socket.disconnect();
    };
  }, [currentUser, incrementUnreadMessages, updateLatestMessageInChat]);  

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
        updateLatestMessageInChat(message);
        clearUnreadMessages(message.chatId);
      };

      socket.on('message', handleMessage);

      return () => {
        socket.emit('leaveRoom', selectedChat._id);
        socket.off('message', handleMessage);
      };
    }
  }, [selectedChat, updateLatestMessageInChat, clearUnreadMessages]);

  const fetchChats = useCallback(async () => {
    const response = await getChatsAPI();
    console.log('fetchChats response:', response); 
    if (response.success) {
      const sortedChats = response.data.sort((a, b) => {
        const dateA = new Date(a.latestMessage?.createdAt || 0);
        const dateB = new Date(b.latestMessage?.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      setChats(sortedChats);
    }
  }, []);

  const markMessagesAsRead = useCallback((chatId: string) => {
    if (currentUser) {
      socket.emit('markMessagesRead', { userId: currentUser._id, chatId });
    }
  }, [currentUser]);

  const selectChat = useCallback(async (chat: Chat) => {
    setSelectedChat(chat);
    const response = await getMessagesAPI(chat._id);
    if (response.success) {
      setMessages(response.data);
      clearUnreadMessages(chat._id);
      markMessagesAsRead(chat._id);
    }
  }, [clearUnreadMessages, markMessagesAsRead]);

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
      console.log('New chat created:', response.data);
      setChats((prevChats) => [...prevChats, response.data]);
      socket.emit('newChat', response.data);
    }
  }, []);

  const setTyping = (isTyping: boolean) => {
    if (selectedChat && socket) {
      socket.emit('typing', selectedChat._id, currentUser?._id, isTyping);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        selectedChat,
        setSelectedChat,
        messages,
        selectChat,
        sendMessage,
        fetchChats,
        createChat,
        setTyping,
        onlineUsers,
        typingUsers,
        unreadMessages,
      }}
    >
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
