import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Chat } from '../types/chat';
import { useAuth } from '../context/AuthContext';
import { getChatName, getChatDescription } from '../utils/chatUtils';

interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const { user } = useAuth();
  const chatName = getChatName(chat, user!);
  const chatDescription = getChatDescription(chat, user);

  // Determine the avatar to show in the chat header
  const chatAvatar = chat.isGroupChat
    ? chat.groupAvatar || 'https://via.placeholder.com/150'
    : chat.users.find(u => u._id !== user?._id)?.avatar || 'https://via.placeholder.com/150';

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
