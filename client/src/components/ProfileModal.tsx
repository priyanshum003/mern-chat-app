import React from 'react';
import { Avatar, Modal } from 'antd';

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
      centered
      className="profile-modal w-full max-w-md p-0 rounded-lg shadow-lg"
      bodyStyle={{ padding: '24px' }} // Add padding for better spacing
    >
      <div className="flex flex-col items-center text-center">
        <Avatar size={120} src={user.avatar} className="mb-4 border-4 border-blue-500" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
        <p className="text-lg text-gray-700 mb-6">{user.email}</p>
        {/* Optional: Add a button to close the modal if needed */}
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ProfileModal;
