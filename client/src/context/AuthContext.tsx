import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser as getCurrentUserAPI, login as loginUserAPI, register as registerUserAPI, logout as logoutUserApi } from '../api/auth.api';
import { AuthApiResponse, User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string , avatar?: File) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response: AuthApiResponse = await getCurrentUserAPI();
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      } finally {
        setIsLoading(false); // Finished loading
      }
    };
    fetchCurrentUser();
    console.log(user, "User")
  }, []);

  const login = async (email: string, password: string) => {
    const response: AuthApiResponse = await loginUserAPI(email, password);
    const user = response.data.user;
    setUser(user);
  };

  const register = async (name: string, email: string, password: string, avatar?: File) => {
    const response: AuthApiResponse = await registerUserAPI(name, email, password, avatar);
    const user = response.data.user;
    setUser(user);
  };

  const logout = async () => {
    await logoutUserApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
