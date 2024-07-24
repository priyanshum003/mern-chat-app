import { CloseOutlined } from '@ant-design/icons';
import { Avatar, Modal } from 'antd';
import React from 'react';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: {
    avatar: string;
    name: string;
    email: string;
    _id: string;
  };
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose, user }) => {
  return (
    <Modal
      open={visible}
      title={null} // Remove title to use custom styling
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined style={{ color: 'white', fontSize: '16px', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '8px', borderRadius: '50%' }} />}
      centered
      className="profile-modal w-full max-w-md p-0 rounded-lg shadow-lg"
    >
      <div className="flex flex-col items-center text-center">
        <Avatar size={120} src={user.avatar} className="mb-4 border-4 border-blue-500" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
        <p className="text-lg text-gray-700 mb-6">{user.email}</p>
      </div>
      
    </Modal>
  );
};

export default ProfileModal;
