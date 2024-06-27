import { Request, Response } from 'express';
import User from '../models/user.model';
import { IUserDocument } from '../types/user';
import jwt from 'jsonwebtoken';
import { apiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth.middleware';

const cookieOptions = {
  httpOnly: true,
  secure: true, // Set to true if using HTTPS
  sameSite: 'strict' as const,
};

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return apiResponse(res, 400, false, 'User already exists');
  }

  const newUser: IUserDocument = new User({ name, email, password, avatar });
  await newUser.save();

  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  newUser.refreshToken = refreshToken;
  await newUser.save();

  const userResponse = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
  }

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);
  return apiResponse(res, 201, true, 'User registered successfully', { user: userResponse });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: IUserDocument | null = await User.findOne({ email });
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

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  }

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);
  return apiResponse(res, 200, true, 'User logged in successfully', { user: userResponse })
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  const user: IUserDocument | null = await User.findById(userId);
  if (!user) {
    return apiResponse(res, 400, false, 'User not found');
  }

  user.refreshToken = '';
  await user.save();

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return apiResponse(res, 200, true, 'Logged out successfully');
});

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

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id; // Assuming user ID is added to req by a middleware

  const user: IUserDocument | null = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    return apiResponse(res, 404, false, 'User not found');
  }

  return apiResponse(res, 200, true, 'User data retrieved successfully', { user });
});

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