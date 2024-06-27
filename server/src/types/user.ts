import { Document } from "mongoose";

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