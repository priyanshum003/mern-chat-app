import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Chat } from '../types/chat';
import { getChatAvatar, getChatDescription, getChatName } from '../utils/chatUtils';

interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const { user: currentUser } = useAuth();

  if (!currentUser) {
    console.error('Current user not found');
    return null; // or render a placeholder
  }

  const chatName = getChatName(chat, currentUser);
  const chatDescription = getChatDescription(chat, currentUser);
  const chatAvatar = getChatAvatar(chat, currentUser);

  return (
    <div className="chat-header flex items-center p-4 border-b border-gray-200 bg-white">
      <Avatar
        icon={<UserOutlined />}
        src={chatAvatar}
        size="large"
        className="mr-4"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-lg">{chatName}</span>
        <span className="text-gray-500">{chatDescription}</span>
      </div>
    </div>
  );
};

export default ChatHeader;
