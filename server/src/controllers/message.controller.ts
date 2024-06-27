import { Request, Response } from 'express';
import Message from '../models/message.model';
import Chat from '../models/chat.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import { IMessage } from '../types/message';
import { io } from '../socket';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return apiResponse(res, 400, false, 'Content and chatId are required');
  }

  const message = new Message({
    sender: req.user._id,
    content,
    chatId,
  } as IMessage)

  const createdMessage = await message.save();
  await Chat.findByIdAndUpdate(chatId, { $push: { messages: createdMessage._id } });
  await createdMessage.populate('sender', 'name email');

  io.to(chatId).emit('message', createdMessage);

  apiResponse(res, 201, true, 'Message sent successfully', createdMessage);
});

export const getMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chatId })
    .populate('sender', 'name email')
    .populate('chatId');

  apiResponse(res, 200, true, 'Messages retrieved successfully', messages);
});
