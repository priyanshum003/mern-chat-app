import { Server } from 'socket.io';
import http from 'http';
import app from './app';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`Client ${socket.id} joined room ${room}`);
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`Client ${socket.id} left room ${room}`);
    });

    socket.on('chatMessage', (message) => {
        io.to(message.room).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

export { server, io };
