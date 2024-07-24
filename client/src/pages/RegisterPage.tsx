import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<RcFile | undefined>();
  const [loading, setLoading] = useState(false); // Loading state

  const handleAvatarChange = (info: UploadChangeParam) => {
    const file = info.fileList.length > 0 ? info.fileList[0].originFileObj : undefined;
    setAvatar(file);
  };

  const handleSubmit = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      await register(values.name, values.email, values.password, avatar);
      message.success('Registered successfully!');
      navigate('/chat');
    } catch (error) {
      message.error('Registration failed. Please try again.');
      console.error('Registration Error:', error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="register-page flex items-center justify-center h-screen bg-gray-100">
      <Form
        name="register"
        onFinish={handleSubmit}
        className="register-form w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg"
      >
        <Title level={2} className="text-center">Register</Title>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          hasFeedback
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item
          name="avatar"
          label="Avatar"
        >
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleAvatarChange}
            accept="image/*"
            maxCount={1} // Restrict to one file
          >
            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            Register
          </Button>
        </Form.Item>
        <div className="text-center">
          <Text>Already have an account?</Text>
          <a href="/login" className="text-blue-500 hover:underline ml-1">
            Login
          </a>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;