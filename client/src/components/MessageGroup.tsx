import { UserOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';
import React from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { Message } from '../types/chat';
import { formatMessageTime } from '../utils/messageUtils';


interface MessageGroupProps {
    date: string;
    messages: Message[];
    currentUserID: string;
    isGroupChat: boolean;
}

const MessageGroup: React.FC<MessageGroupProps> = ({ date, messages, currentUserID, isGroupChat }) => {
    const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif)$/.test(url) || url.includes('giphy.com/media');

    const renderMessageContent = (content: string) => {
        if (isImageUrl(content)) {
            return <img src={content} alt="content" className="max-w-full" />;
        }
        try {
            const url = new URL(content);
            const extension = url.pathname.split('.').pop();
            if (extension) {
                return (
                    <div className="flex items-center">
                        <FileIcon extension={extension} {...defaultStyles[extension as keyof typeof defaultStyles]} />
                        <a href={content} target="_blank" rel="noopener noreferrer" className="ml-2">
                            {url.pathname.split('/').pop()}
                        </a>
                    </div>
                );
            }
        } catch (e) {
            return <div className="message-text">{content}</div>;
        }
        return <div className="message-text">{content}</div>;
    };

    return (
        <div className="message-group">
            <div className="date-badge bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-center mb-4">
                {date}
            </div>
            <List
                dataSource={messages}
                renderItem={(message) => {
                    const isCurrentUser = message.sender._id === currentUserID;
                    return (
                        <List.Item
                            className={`flex ${isCurrentUser ? '!justify-end' : '!justify-start'}`}
                        >
                            <div
                                className={`message-content max-w-xs p-2 rounded-lg shadow-sm ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white text-black'} border-gray-200`}
                            >
                                {isGroupChat && !isCurrentUser && (
                                    <div className="flex items-center mb-1">
                                        <Avatar
                                            icon={<UserOutlined />}
                                            src={message.sender.avatar}
                                            className="mr-2"
                                        />
                                        <div className="message-sender font-semibold text-sm text-gray-700">
                                            {message.sender.name}
                                        </div>
                                    </div>
                                )}
                                {renderMessageContent(message.content)}
                                <div className="message-time text-xs text-gray-400 mt-1 text-right">
                                    {formatMessageTime(message.createdAt)}
                                </div>
                            </div>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default MessageGroup;
