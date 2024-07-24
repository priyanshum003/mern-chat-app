import { Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinaryConfig';
import { AuthRequest } from '../middlewares/auth.middleware';
import User from '../models/user.model';
import { IUserDocument, LoginRequest, RegisterUserRequest, UserResponse } from '../types/user';
import { apiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const cookieOptions = {
  httpOnly: true,
  secure: true, 
  sameSite: 'strict' as const,
};

// Register a new user
export const registerUser = asyncHandler(async (req: RegisterUserRequest, res: Response) => {
  console.log(req.body, "Register User");
  const { name, email, password } = req.body;

  let avatar = '';
  if (req.file && req.file.path) {
    avatar = req.file.path;
    const uploadResult = await cloudinary.uploader.upload(avatar);

    fs.unlinkSync(avatar);
    avatar = uploadResult.secure_url;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return apiResponse(res, 400, false, 'User already exists');
  }

  const newUser: IUserDocument = new User({ name, email, password});
  if (avatar && avatar.length > 0) {
    newUser.avatar = avatar;
  }
  await newUser.save();

  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  newUser.refreshToken = refreshToken;
  await newUser.save();

  const userResponse: UserResponse = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);
  return apiResponse(res, 201, true, 'User registered successfully', { user: userResponse });
});

// Login a user
export const loginUser = asyncHandler(async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return apiResponse(res, 400, false, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return apiResponse(res, 400, false, 'Invalid credentials');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  const userResponse: UserResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);
  return apiResponse(res, 200, true, 'User logged in successfully', { user: userResponse });
});

// Logout a user
export const logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return apiResponse(res, 401, false, 'Unauthorized');
  }

  const user = req.user;
  user.refreshToken = '';
  await user.save();

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return apiResponse(res, 200, true, 'Logged out successfully');
});

// Refresh the access token
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return apiResponse(res, 400, false, 'No refresh token provided');
  }

  const user: IUserDocument | null = await User.findOne({ refreshToken });
  if (!user) {
    return apiResponse(res, 400, false, 'Invalid refresh token');
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return apiResponse(res, 400, false, 'Invalid refresh token');
    }

    const accessToken = user.generateAccessToken();
    res.cookie('accessToken', accessToken, cookieOptions);
    return apiResponse(res, 200, true, 'Access token refreshed successfully');
  });
});

// Get the current logged-in user
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    return apiResponse(res, 404, false, 'User not found');
  }

  return apiResponse(res, 200, true, 'User data retrieved successfully', { user });
});

// Search for users by name or email
export const searchUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { query } = req.query;

  if (!query) {
    return apiResponse(res, 400, false, 'Query is required');
  }

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ],
    _id: { $ne: req.user._id } // Exclude the current logged-in user
  }).select('-password'); // Exclude the password field

  return apiResponse(res, 200, true, 'Users retrieved successfully', { users });
});