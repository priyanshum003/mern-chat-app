import { Layout } from 'antd';
import React, { useState } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatMessages from '../components/ChatMessages';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import { useChat } from '../context/ChatContext';
import Header from '../components/Header';

const { Content } = Layout;

const ChatPage: React.FC = () => {
  const { selectedChat, sendMessage } = useChat();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false); // State to control drawer visibility

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header toggleDrawer={toggleDrawer} />
      <div className="flex flex-1 flex-row justify-center items-stretch overflow-auto">
        <Sidebar isDrawerVisible={isDrawerVisible} toggleDrawer={toggleDrawer} />
        <div className="flex flex-col flex-1 overflow-auto">
          {selectedChat ? (
            <>
              <ChatHeader chat={selectedChat} />
              <Content className="flex flex-col flex-1 bg-light-bg">
                <div className="flex-1 overflow-y-auto">
                  <ChatMessages />
                </div>
                <div className="shrink-0">
                  <MessageInput onSendMessage={sendMessage} />
                </div>
              </Content>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                  Select a chat to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
