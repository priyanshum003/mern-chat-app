import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Drawer, Input, Layout, List, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { searchUser } from '../api/auth.api';
import { createChat } from '../api/chats.api';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { User } from '../types/auth';
import { Chat } from '../types/chat';
import { getChatName } from '../utils/chatUtils';
import { formatSidebarDate, truncateMessage } from '../utils/messageUtils';
import GroupChatForm from './GroupChatForm';

const { Sider } = Layout;
const { Search } = Input;

interface SidebarProps {
  isDrawerVisible: boolean;
  toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isDrawerVisible, toggleDrawer }) => {
  const { chats, fetchChats, selectChat, selectedChat, onlineUsers, unreadMessages } = useChat();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleSearch = useCallback(async (value: string) => {
    setSearchQuery(value);
    if (value) {
      const response = await searchUser(value);
      if (response.success) {
        setSearchResults(response.data.users);
      }
    } else {
      setSearchResults([]);
    }
  }, []);

  const handleUserSelect = useCallback(async (user: User) => {
    try {
      const response = await createChat([user._id], false);
      if (response.success) {
        const newChat = response.data;

        fetchChats();
        selectChat(newChat);
        setSearchQuery('');
        if (isDrawerVisible) {
          toggleDrawer();
        }
      } else {
        message.error('Failed to create chat');
      }
    } catch (error) {
      message.error('Error creating chat');
    }
  }, [fetchChats, selectChat, toggleDrawer, isDrawerVisible]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers[userId] === 'online';
  };

  const handleChatSelect = (chat: Chat) => {
    selectChat(chat);
    if (isDrawerVisible) {
      toggleDrawer();
    }
  };

  const sidebarContent = (
    <div className="bg-dark-bg h-full flex flex-col">
      <div className="sidebar-header mb-4">
        <Search
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="mt-2 mb-4"
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal} className="w-full">
          Create Group Chat
        </Button>
      </div>
      <div className="flex-1">
        <List
          itemLayout="horizontal"
          dataSource={searchQuery ? searchResults : chats}
          renderItem={(item: User | Chat) => {
            if ('chatName' in item || 'users' in item) {
              const chat = item as Chat;
              const chatName = getChatName(chat, currentUser!);
              const chatAvatar = chat.isGroupChat
                ? chat.groupAvatar
                : chat.users.find((u) => u._id !== currentUser?._id)?.avatar;
              const latestMessage = chat.latestMessage
                ? truncateMessage(chat.latestMessage.content, 30)
                : 'No messages yet';
              const messageTime = chat.latestMessage
                ? formatSidebarDate(chat.latestMessage.createdAt)
                : '';
              const chatUser = chat.users.find((u) => u._id !== currentUser?._id);
              const isOnline = chatUser && isUserOnline(chatUser._id);
              const unreadCount = unreadMessages[chat._id] || 0;

              return (
                <List.Item
                  className={`hover:bg-gray-800 cursor-pointer !p-5 mb-2 rounded-md ${selectedChat?._id === chat._id ? 'bg-gray-800 border-l-4 border-blue-500 p-5' : ''}`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="relative">
                        <Badge count={unreadCount} offset={[-10, 10]} size="small">
                          <Avatar src={chatAvatar} className="w-12 h-12" />
                        </Badge>
                        {!chat.isGroupChat && isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                    }
                    title={
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{chatName}</span>
                        <small className="text-gray-500">{messageTime}</small>
                      </div>
                    }
                    description={
                      <span className={`text-gray-400 ${unreadCount > 0 ? 'font-bold' : ''}`}>
                        {latestMessage}
                      </span>
                    }
                  />
                </List.Item>
              );
            } else {
              const user = item as User;
              return (
                <List.Item className="hover:bg-gray-800 cursor-pointer" onClick={() => handleUserSelect(user)}>
                  <List.Item.Meta
                    avatar={<Avatar src={user.avatar} />}
                    title={<span className="font-semibold text-white">{user.name}</span>}
                    description={<span className="text-gray-400">{user.email}</span>}
                  />
                </List.Item>
              );
            }
          }}
        />
      </div>
      <GroupChatForm open={isModalVisible} onClose={handleCancel} />
    </div>
  );

  return (
    <>
      <Drawer
        placement="left"
        closable
        onClose={toggleDrawer}
        open={isDrawerVisible}
        className="p-0"
        style={{
          backgroundColor: '#001529',
          color: 'white',
          fontSize: '1.1rem',
        }}
        closeIcon={<CloseOutlined className="text-white hover:text-gray-400 text-xl bg-gray-800 p-1 rounded" />}
      >
        {sidebarContent}
      </Drawer>
      <Sider width={350} className="sidebar bg-dark-bg p-4 text-white flex flex-col hidden md:flex overflow-hidden overflow-y-scroll">
        {sidebarContent}
      </Sider>
    </>
  );
};

export default Sidebar;