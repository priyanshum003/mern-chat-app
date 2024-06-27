import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, Layout, List, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { searchUser } from '../api/auth.api';
import { createChat } from '../api/chats.api';
import { useChat } from '../context/ChatContext';
import { User } from '../types/auth';
import { Chat } from '../types/chat';
import GroupChatForm from './GroupChatForm';
import { getChatName } from '../utils/chatUtils';
import { useAuth } from '../context/AuthContext';

const { Sider } = Layout;
const { Search } = Input;

const Sidebar: React.FC = () => {
  const { chats, fetchChats, selectChat } = useChat();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const { setSelectedChat, selectedChat } = useChat();
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
        fetchChats(); // Refresh the chat list
        setSelectedChat(response.data);
        setSearchQuery('');
      } else {
        message.error('Failed to create chat');
      }
    } catch (error) {
      message.error('Error creating chat');
    }
  }, [fetchChats]);

  useEffect(() => {
    console.log(selectedChat);
  }, [selectedChat]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Sider width={300} className="sidebar bg-gray-900 p-4 text-white h-screen">
      <div className="sidebar-header mb-4">
        <h3 className="text-xl font-semibold">Chat Buddies</h3>
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
      <List
        itemLayout="horizontal"
        dataSource={searchQuery ? searchResults : chats}
        renderItem={(item: User | Chat) => {
          if ('chatName' in item || 'users' in item) {
            // This is a chat
            const chat = item as Chat;
            const chatName = getChatName(chat, currentUser!);
            const chatAvatar = chat.isGroupChat
              ? chat.groupAvatar
              : chat.users.find((u) => u._id !== currentUser?._id)?.avatar;

            return (
              <List.Item className="hover:bg-gray-800 cursor-pointer" onClick={() => selectChat(chat)}>
                <List.Item.Meta
                  avatar={<Avatar src={chatAvatar || 'https://via.placeholder.com/150'} />}
                  title={<span className="font-semibold text-white">{chatName}</span>}
                  description={
                    <span className="text-gray-400">
                      {chat.latestMessage ? chat.latestMessage.content : 'No messages yet'}
                      <br />
                      {chat.latestMessage && (
                        <small className="text-gray-500">
                          {new Date(chat.latestMessage.createdAt).toLocaleString()}
                        </small>
                      )}
                    </span>
                  }
                />
              </List.Item>
            );
          } else {
            // This is a user search result
            const user = item as User;
            return (
              <List.Item className="hover:bg-gray-800 cursor-pointer" onClick={() => handleUserSelect(user)}>
                <List.Item.Meta
                  avatar={<Avatar src={user.avatar || 'https://via.placeholder.com/150'} />}
                  title={<span className="font-semibold text-white">{user.name}</span>}
                  description={<span className="text-gray-400">{user.email}</span>}
                />
              </List.Item>
            );
          }
        }}
      />
      <GroupChatForm open={isModalVisible} onClose={handleCancel} />
    </Sider>
  );
};

export default Sidebar;
