import { Request } from 'express';
import { Document } from "mongoose";
import Multer from 'multer';

export interface IUserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  refreshToken?: string;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  refreshToken?: string;
}

// User Controller Types
export interface RegisterUserRequest extends Request {
  file?: Multer.File;
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface AuthRequest extends Request {
  user: IUserDocument;
}

// User Response Interfaces
export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}