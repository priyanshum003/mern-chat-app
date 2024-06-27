import { Layout } from 'antd';
import React from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatMessages from '../components/ChatMessages';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import { useChat } from '../context/ChatContext';

const { Content } = Layout;

const ChatPage: React.FC = () => {
  const { selectedChat, sendMessage } = useChat();

  return (
    <Layout className="h-screen">
      <Sidebar />
      <Layout>
        {selectedChat && (
          <>
            <ChatHeader chat={selectedChat} />
            <Content className="chat-content flex flex-col bg-white">
              <ChatMessages />
              <MessageInput onSendMessage={sendMessage} />
            </Content>
          </>
        )}
      </Layout>
    </Layout>
  );
};

export default ChatPage;
