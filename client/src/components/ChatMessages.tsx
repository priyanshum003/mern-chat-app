import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { groupMessagesByDate } from "../utils/messageUtils";
import MessageGroup from './MessageGroup';

const ChatMessages: React.FC = () => {
  const { messages, selectedChat } = useChat();
  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  if (!selectedChat) return null;
  if (!currentUser) return null;

  return (
    <div className="chat-messages flex-1 overflow-y-auto p-4 bg-light-bg overflow-x-hidden">
      {Object.keys(groupedMessages).map((date) => (
        <MessageGroup
          key={date}
          date={date}
          messages={groupedMessages[date]}
          currentUserID={currentUser._id}
          isGroupChat={selectedChat.isGroupChat}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
