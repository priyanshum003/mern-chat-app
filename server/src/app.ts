import cookieParser from 'cookie-parser';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import chatRoutes from './routes/chat.route';
import fileUploadRouter from './routes/fileUpload.route';
import messageRoutes from './routes/message.route';
import userRoutes from './routes/user.route';
import path from 'path';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', fileUploadRouter);

// Deployment Configuration
const rootDir = path.resolve(__dirname, '../../'); 

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(rootDir, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(rootDir, 'client', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Error handling middleware should be the last middleware
app.use(errorHandler);

export default app;
