import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Input, Select, Button } from 'antd';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/auth';
import { searchUser } from '../api/auth.api';

const { Option } = Select;

interface GroupChatFormProps {
  open: boolean;
  onClose: () => void;
}

const GroupChatForm: React.FC<GroupChatFormProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const { createChat } = useChat();
  const [chatName, setChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async (query: string) => {
    if (!user) return;
    try {
      const response = await searchUser(query);
      if (response.success) {
        setSearchResults(response.data.user.filter((u) => u._id !== user._id));
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [user]);

  useEffect(() => {
    if (search) {
      fetchUsers(search);
    } else {
      setSearchResults([]);
    }
  }, [search, fetchUsers]);

  const handleCreateGroupChat = async () => {
    if (!user) return;
    await createChat({ users: selectedUsers, isGroupChat: true, chatName, groupAdmin: user._id });
    onClose();
  };

  return (
    <Modal open={open} title="Create Group Chat" onCancel={onClose} footer={null}>
      <Input
        placeholder="Chat Name"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
        className="mb-2"
      />
      <Select
        mode="multiple"
        placeholder="Search and Add Users"
        value={selectedUsers}
        onChange={(value) => setSelectedUsers(value)}
        onSearch={(value) => setSearch(value)}
        filterOption={false}
        className="w-full mb-4"
        notFoundContent={null}
      >
        {searchResults.map((user) => (
          <Option key={user._id} value={user._id}>
            {user.name}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={handleCreateGroupChat} className="w-full">
        Create
      </Button>
    </Modal>
  );
};

export default GroupChatForm;
