import React, { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthRedirect from './components/AuthRedirect';
import Loader from './components/Loader';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

const ChatPage = lazy(() => import('./pages/ChatPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

const App: React.FC = () => {

  const { user } = useAuth();
 
  if(!user) {
    return <Loader />;
  }

  return (
    <Router>
      <AuthRedirect>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/chat" element={<ChatPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthRedirect>
    </Router>
  );
};

export default App;