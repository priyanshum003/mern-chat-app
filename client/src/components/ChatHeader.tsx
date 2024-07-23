import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Chat } from '../types/chat';
import { getChatAvatar, getChatName } from '../utils/chatUtils';
import ChatInfoModal from './ChatInfoModal';

interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const { user: currentUser } = useAuth();
  const { onlineUsers, typingUsers } = useChat();
  const [isModalVisible, setModalVisible] = useState(false);

  if (!currentUser) {
    console.error('Current user not found');
    return null;
  }

  const chatName = getChatName(chat, currentUser);
  const chatAvatar = getChatAvatar(chat, currentUser);

  const formatTypingUsers = (typingUserIds: string[]) => {
    const names = typingUserIds.map(userId => chat.users.find(u => u._id === userId)?.name).filter(Boolean);
    switch (names.length) {
      case 0:
        return '';
      case 1:
        return `${names[0]} is typing...`;
      case 2:
        return `${names[0]} and ${names[1]} are typing...`;
      default:
        return `${names[0]}, ${names[1]} and others are typing...`;
    }
  };

  const typingStatus = formatTypingUsers(typingUsers[chat._id] || []);

  const otherUserId = chat.users.find(user => user._id !== currentUser._id)?._id;
  const onlineStatus = chat.isGroupChat
    ? `${chat.users.length} participants`
    : otherUserId && onlineUsers[otherUserId] === 'online'
      ? 'online'
      : 'last seen recently';

  const handleHeaderClick = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div className="chat-header flex items-center p-4 bg-gray-800 cursor-pointer" onClick={handleHeaderClick}>
        <Avatar size={48} src={chatAvatar} icon={<UserOutlined />} />
        <div className="chat-info ml-4">
          <div className="chat-name text-lg font-semibold text-white">{chatName}</div>
          <div className="chat-description text-gray-400">
            {typingStatus ? (
              <span className="text-green-500">{typingStatus}</span>
            ) : (
              <span className="text-green-500">{onlineStatus}</span>
            )}
          </div>
        </div>
      </div>
      <ChatInfoModal chat={chat} visible={isModalVisible} onClose={handleModalClose} />
    </>
  );
};

export default ChatHeader;
