import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages);

export default router;
