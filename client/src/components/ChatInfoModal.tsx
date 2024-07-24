import { CloseOutlined } from '@ant-design/icons';
import { Avatar, Modal } from 'antd';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Chat } from '../types/chat';
import { getChatAvatar, getChatName } from '../utils/chatUtils';

interface ChatInfoModalProps {
    chat: Chat;
    visible: boolean;
    onClose: () => void;
}

const ChatInfoModal: React.FC<ChatInfoModalProps> = ({ chat, visible, onClose }) => {
    const { user: currentUser } = useAuth();

    if (!currentUser) {
        console.error('Current user not found');
        return null;
    }

    const chatName = getChatName(chat, currentUser);
    const chatAvatar = getChatAvatar(chat, currentUser);
    const description = chat.isGroupChat
        ? `Group chat with ${chat.users.length} participants`
        : `1-on-1 chat with ${chat.users.find(user => user._id !== currentUser._id)?.name}`;

    // Format the createdAt date using JavaScript's Date object
    const createdAtDate = new Date(chat.createdAt);
    const createdAt = `${createdAtDate.toLocaleString('en-US', { month: 'long' })} ${createdAtDate.getDate()}${getOrdinalSuffix(createdAtDate.getDate())} ${createdAtDate.getFullYear()}, ${createdAtDate.toLocaleTimeString('en-US')}`;

    // Function to get the ordinal suffix for a date
    function getOrdinalSuffix(day: number) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            className="w-full max-w-md p-0 overflow-hidden rounded-lg shadow-lg"
            closeIcon={<CloseOutlined style={{ color: 'white', fontSize: '16px' , backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '8px', borderRadius: '50%' }} />}
        >
            <div className="flex flex-col text-center">
                <div className="bg-blue-600 p-6 text-white rounded-t-lg flex flex-col items-center">
                    <Avatar size={80} src={chatAvatar} className="mb-4" />
                    <div className="text-2xl font-bold mb-2">{chatName}</div>
                    <div className="text-base">{description}</div>
                </div>
                <div className="p-6 bg-white border-t border-gray-200">
                    <div className="text-gray-600 text-sm mb-4">
                        {chat.isGroupChat ? 'Group created on' : 'Chat started on'}: {createdAt}
                    </div>
                     {chat.isGroupChat && (
                        <div className="w-full">
                            <strong className="text-gray-900">Participants:</strong>
                            <ul className="list-disc list-inside ml-4 mt-2">
                                {chat.users.map(user => (
                                    <li key={user._id} className="text-gray-800 flex items-center mt-2">
                                        <Avatar size={40} src={user.avatar} className="mr-3" />
                                        <span className="text-base">{user.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ChatInfoModal;
