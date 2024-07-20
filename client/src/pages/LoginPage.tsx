import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      message.success('Logged in successfully!');
      navigate('/chat');
    } catch (error) {
      message.error('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Form
        name="login"
        onFinish={handleSubmit}
        className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow"
      >
        <Title level={2} className="text-center">Login</Title>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Login
          </Button>
        </Form.Item>
        <div className="text-center">
          <Text>Don't have an account?</Text>
          <a href="/register" className="text-blue-500 hover:underline ml-1">
            Register
          </a>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
