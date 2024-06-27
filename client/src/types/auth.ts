export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}
export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface SearchUserResponse {
  success: boolean;
  data: {
    users: User[];
  };
  message?: string;
}