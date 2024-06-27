import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { Avatar, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { FileIcon, defaultStyles } from 'react-file-icon';

const ChatMessages: React.FC = () => {
  const { messages, selectedChat } = useChat();
  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
            <FileIcon extension={extension} {...defaultStyles[extension]} />
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
    <div className="chat-messages flex-1 overflow-y-auto p-4 bg-gray-100 overflow-x-hidden">
      <List
        dataSource={messages}
        renderItem={(message) => {
          const isCurrentUser = message.sender._id === currentUser?._id;
          const isGroupChat = selectedChat?.isGroupChat;

          return (
            <List.Item
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
              style={{ justifyContent: `${isCurrentUser ? 'flex-end' : 'flex-start'}` }}
            >
              <div
                className={`message-content max-w-xs p-2 rounded-lg shadow-sm ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white text-black'
                  }`}
              >
                {isGroupChat && !isCurrentUser && (
                  <>
                    <Avatar
                      icon={<UserOutlined />}
                      src={message.sender.avatar}
                      className="mr-2"
                    />
                    <div className="message-sender font-semibold text-sm text-gray-700">
                      {message.sender.name}
                    </div>
                  </>
                )}
                {renderMessageContent(message.content)}
              </div>
            </List.Item>
          );
        }}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
