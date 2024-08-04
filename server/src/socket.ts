import { Server } from "socket.io";
import http from "http";
import app from "./app";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Maps userId to an array of socketIds to handle multiple connections from the same user
const users: { [userId: string]: string[] } = {}; // userId -> [socketId]
const typingUsers: { [chatId: string]: string[] } = {}; // chatId -> [userId]
const unreadMessages: { [userId: string]: { [chatId: string]: number } } = {};

function getOnlineUsers() {
  return Object.keys(users).filter((userId) => users[userId].length > 0);
}

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // User connected
  socket.on("userConnected", (userId: string) => {
    if (!users[userId]) {
      users[userId] = [];
    }
    if (!users[userId].includes(socket.id)) {
      users[userId].push(socket.id);
    }

    // Emit the updated list of online users to the newly connected user
    socket.emit("currentOnlineUsers", getOnlineUsers());

    // Notify all clients about the user's online status
    io.emit("updateUserStatus", { userId, status: "online" });
    console.log("User connected", userId);
  });

  // User Joined Room
  socket.on("joinRoom", (room: string) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room ${room}`);
  });

  // User Left Room
  socket.on("leaveRoom", (room: string) => {
    socket.leave(room);
    console.log(`Client ${socket.id} left room ${room}`);
  });

  // User Typing
  socket.on("typing", (chatId: string, userId: string, isTyping: boolean) => {
    if (isTyping) {
      if (!typingUsers[chatId]) {
        typingUsers[chatId] = [];
      }
      if (!typingUsers[chatId].includes(userId)) {
        typingUsers[chatId].push(userId);
      }
    } else {
      if (typingUsers[chatId]) {
        typingUsers[chatId] = typingUsers[chatId].filter((id) => id !== userId);
      }
    }
    // Emit typing status to other users in the chat
    socket.to(chatId).emit("typingStatus", {
      chatId,
      typingUsers: typingUsers[chatId] || [],
    });
  });

  // New Chat Created
  socket.on("newChat", (chat: any) => {
    console.log("New chat created", chat);
    const chatMembers = chat.users;

    // Notify users in the chat about the new chat
    chatMembers.forEach((userId: string) => {
      if (users[userId]) {
        users[userId].forEach((socketId: string) => {
          io.to(socketId).emit("newChatNotification", chat);
        });
      }
    });
  });

  // Chat Message
  socket.on("chatMessage", (message) => {
    const room = message.chatId; // Assuming chatId is the room identifier

    // Broadcast the message to everyone in the room
    io.to(room).emit("message", message);

    // Identify all users in the room
    const roomUsers = Object.keys(users).filter((userId) => {
      return Array.from(
        io.sockets.sockets.get(users[userId][0])?.rooms || []
      ).includes(room);
    });

    console.log('Room users:', roomUsers);

    // Notify users in the room about the new message (excluding the sender)
    roomUsers.forEach((userId) => {
      if (userId !== message.sender._id) {
        console.log('Notifying user:', userId);
        users[userId].forEach((socketId) => {
          io.to(socketId).emit("newMessageNotification", message);
        });
      }
    });

    // Increment unread messages for users not in the room
    Object.keys(users).forEach((userId) => {
      if (!roomUsers.includes(userId)) {
        if (!unreadMessages[userId]) {
          unreadMessages[userId] = {};
        }
        if (!unreadMessages[userId][room]) {
          unreadMessages[userId][room] = 0;
        }
        unreadMessages[userId][room]++;
        console.log(`Unread messages for user ${userId}:`, unreadMessages[userId]);
      }
    });

    // Emit latest message to all users for updating sidebar
    io.emit("latestMessage", message);
  });
  

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    const userId = Object.keys(users).find((key) =>
      users[key].includes(socket.id)
    );
    if (userId) {
      users[userId] = users[userId].filter((id) => id !== socket.id);
      if (users[userId].length === 0) {
        delete users[userId];
        // Emit updated list of online users to all clients
        io.emit("currentOnlineUsers", getOnlineUsers());
        // Notify all clients about the user's offline status
        io.emit("updateUserStatus", { userId, status: "offline" });
      } else {
        // Emit the updated list of online users to all remaining clients
        io.emit("currentOnlineUsers", getOnlineUsers());
      }
    }
  });
});

export { server, io };
