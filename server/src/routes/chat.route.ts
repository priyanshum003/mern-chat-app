import express from 'express';
import { createChat, getChats } from '../controllers/chat.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/create',
  protect,
  [
    body('users').isArray({ min: 1 }).withMessage('Users are required'),
    body('isGroupChat').isBoolean().withMessage('isGroupChat must be a boolean')
  ],
  validateRequest,
  createChat
);

router.get('/list', protect, getChats);

export default router;
