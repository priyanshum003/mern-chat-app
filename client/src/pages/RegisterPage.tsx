import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    await register(values.name, values.email, values.password);
    navigate('/chat');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Form
        name="register"
        onFinish={handleSubmit}
        className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow"
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
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
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
