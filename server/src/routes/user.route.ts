import express from 'express';
import { body, query } from 'express-validator';
import {
  getMe,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  searchUsers,
} from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest.middleware';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  validateRequest,
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  loginUser
);

router.post('/refresh-token', refreshAccessToken);

router.post(
  '/logout',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
  ],
  validateRequest,
  logoutUser
);

router.get('/me', protect, getMe);

router.get(
  '/search',
  protect,
  [
    query('query').notEmpty().withMessage('Search query is required'),
  ],
  validateRequest,
  searchUsers
);

export default router;
