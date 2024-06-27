import cookieParser from 'cookie-parser';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import chatRoutes from './routes/chat.route';
import fileUploadRouter from './routes/fileUpload.route';
import messageRoutes from './routes/message.route';
import userRoutes from './routes/user.route';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', fileUploadRouter);

// Error handling middleware should be the last middleware
app.use(errorHandler);

export default app;
