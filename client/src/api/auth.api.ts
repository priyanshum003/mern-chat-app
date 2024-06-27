import { AxiosResponse } from 'axios';
import { AuthApiResponse, SearchUserResponse } from '../types/auth';
import api from './axiosInstance';


export const register = async (name: string, email: string, password: string): Promise<AuthApiResponse> => {
  const response: AxiosResponse<AuthApiResponse> = await api.post(`/users/register`, { name, email, password });
  console.log(response.data, "Register API Response");
  return response.data; // Return the entire API response
};

export const login = async (email: string, password: string) => {
  const response: AxiosResponse<AuthApiResponse> = await api.post(`/users/login`, { email, password });
  console.log(response.data, "Login API Response");
  return response.data; // Return the entire API response
};


export const getCurrentUser = async () => {
  const response = await api.get<AuthApiResponse>('/users/me');
  return response.data;
};

export const logout = async ()=> {
  const response = await api.post<AuthApiResponse>('/users/logout');
  return response.data;
};

export const searchUser = async (query: string)=> {
  const response = await api.get<SearchUserResponse>(`/users/search?query=${query}`);
  return response.data;
};