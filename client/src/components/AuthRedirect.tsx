import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Do not redirect if the current path is '/register' or '/login'
    if (location.pathname === '/register' || location.pathname === '/login') {
      return;
    }

    // Redirect to '/login' if the user is not logged in
    if (!user && location.pathname !== '/login') {
      navigate('/login');
    } else if (user && location.pathname !== '/chat') {
      navigate('/chat');
    }
  }, [user, navigate, location]);

  return <>{children}</>;
};

export default AuthRedirect;
