import { CloseOutlined, GifOutlined, PaperClipOutlined, SmileOutlined } from '@ant-design/icons';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { Button, Input, Upload, UploadProps } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import Picker from 'emoji-picker-react';
import React, { useState, useEffect } from 'react';
import { uploadFileToServer } from '../api/fileUpload.api';
import { useChat } from '../context/ChatContext';

const giphyFetch = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);

const MessageInput: React.FC<{ onSendMessage: (content: string) => void }> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const { selectedChat, setTyping } = useChat();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = () => {
    setTyping(true);
  };

  const handleKeyUp = () => {
    setTimeout(() => {
      setTyping(false);
    }, 1000);
  };

  const handleUpload: UploadProps['onChange'] = async (info: UploadChangeParam) => {
    const file = (info.file.originFileObj || info.file) as RcFile;
    if (!file) {
      console.error('No file found');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { url } = await uploadFileToServer(formData);
      onSendMessage(`${url}`);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const addEmoji = (emojiObject: any, event: any) => {
    setMessage(message + emojiObject.emoji);
  };

  const addGif = (gif: any, e: any) => {
    e.preventDefault();
    onSendMessage(gif.images.original.url);
    setShowGifPicker(false);
  };

  const fetchGifs = (offset: number) => giphyFetch.trending({ offset, limit: 10 });

  useEffect(() => {
    const handleBeforeUnload = () => setTyping(false);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [setTyping]);

  return (
    <div className="relative flex items-center p-4 bg-white border-t border-gray-200">
      {showEmojiPicker && (
        <div className="absolute bottom-24 left-0 z-10 emoji-picker-container">
          <Picker onEmojiClick={addEmoji} />
          <Button
            icon={<CloseOutlined />}
            onClick={() => setShowEmojiPicker(false)}
            className="absolute top-0 right-0"
          />
        </div>
      )}
      {showGifPicker && (
        <div className="absolute bottom-24 left-0 z-10 gif-picker-container" style={{ height: '300px', overflowY: 'scroll' }}>
          <Grid fetchGifs={fetchGifs} width={300} columns={3} onGifClick={addGif} />
          <Button
            icon={<CloseOutlined />}
            onClick={() => setShowGifPicker(false)}
            className="absolute top-0 right-0"
          />
        </div>
      )}
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onPressEnter={handleSend}
        placeholder="Type a message..."
        className="flex-1 mr-2"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
      <Button icon={<SmileOutlined />} onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="mr-2" />
      <Button icon={<GifOutlined />} onClick={() => setShowGifPicker(!showGifPicker)} className="mr-2" />
      <Upload showUploadList={false} beforeUpload={() => false} onChange={handleUpload}>
        <Button icon={<PaperClipOutlined />} className="mr-2" />
      </Upload>
      <Button type="primary" onClick={handleSend}>
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
