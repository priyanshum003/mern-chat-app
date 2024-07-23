import { BellOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Menu, message } from 'antd';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';
// import downward arrow icon from ant design

interface HeaderProps {
    toggleDrawer: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleDrawer }) => {
    const { user: currentUser, logout } = useAuth();
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

    const handleLogout = async () => {
        await logout();
        message.success('Logged out successfully');
    };

    const menu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined style={{ fontSize: '18px', padding: "10px" }} />} onClick={() => setIsProfileModalVisible(true)} style={{ fontSize: '18px' }}>
                Profile
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined style={{ fontSize: '18px', padding: "10px" }} />} onClick={handleLogout} style={{ fontSize: '18px' }}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <div className="header bg-dark-bg flex items-center justify-between p-4">
                <div className="header-left flex items-center">
                    <Button
                        type="primary"
                        icon={<MenuOutlined />}
                        onClick={toggleDrawer}
                        className="text-white bg-gray-800 hover:bg-gray-700 border-none shadow-md md:hidden"
                    />
                    <img
                        src="https://cdn.pixabay.com/photo/2012/04/15/21/17/speech-35342_1280.png"
                        alt="Logo"
                        className="h-8 mr-4 ml-2 md:ml-0"
                    />
                    <h1 className="text-xl font-semibold text-white">Chat Buddies</h1>
                </div>
                <div className="header-right flex items-center">
                    <Badge count={1} className="mr-4">
                        <Button type="text" icon={<BellOutlined style={{ fontSize: '20px' }} />} className="text-white hover:text-gray-400" />
                    </Badge>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <div className="flex items-center cursor-pointer">
                            <Avatar src={currentUser?.avatar} className="cursor-pointer" />
                            <p className="text-white ml-2 hidden md:block">{currentUser?.name}</p>
                        </div>
                    </Dropdown>
                </div>
            </div>
            {currentUser && (
                <ProfileModal
                    visible={isProfileModalVisible}
                    onClose={() => setIsProfileModalVisible(false)}
                    user={currentUser}
                />
            )}
        </>
    );
};

export default Header;