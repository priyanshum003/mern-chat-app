import { Request, Response } from 'express';
import Chat from '../models/chat.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';

export const createChat = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { users, isGroupChat, chatName, groupAdmin } = req.body;

    const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);
    if (!users.every((id: string) => isValidObjectId(id))) {
        return apiResponse(res, 400, false, 'Invalid user IDs');
    }

    // Convert string IDs to ObjectId instances
    const userObjectIds = users.map((id: string) => new mongoose.Types.ObjectId(id));

    // Check if a chat already exists with these users
    let existingChat;
    if (!isGroupChat) {
        existingChat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [...userObjectIds, req.user._id], $size: 2 }
        }).populate('users', '-password');
    }

    if (existingChat) {
        return apiResponse(res, 200, true, 'Chat already exists', existingChat);
    }

    const chat = new Chat({
        users: [...userObjectIds, req.user._id], // Include the current user as ObjectId
        isGroupChat,
        chatName: isGroupChat ? chatName : null,
        groupAdmin: isGroupChat ? new mongoose.Types.ObjectId(groupAdmin) : null,
    });

    const createdChat = await chat.save();

    const populatedChat = await createdChat.populate('users', '-password -refreshToken');
    apiResponse(res, 201, true, 'Chat created successfully', populatedChat);
});

export const getChats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const chats = await Chat.find({ users: req.user._id })
        .populate('latestMessage')
        .populate('users', '-password -refreshToken')
        .populate('groupAdmin', '-password -refreshToken');
    apiResponse(res, 200, true, 'Chats retrieved successfully', chats);
});
