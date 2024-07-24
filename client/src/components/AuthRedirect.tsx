import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('user from AuthRedirect :', user);

    // Do not redirect if the current path is '/register' or '/login'
    if (location.pathname === '/register' || location.pathname === '/login') {
      return;
    }

    if (!user) {
      navigate('/login');
    } else {
      navigate('/chat');
    }
  }, [user, navigate, location]);

  return <>{children}</>;
};

export default AuthRedirect;
