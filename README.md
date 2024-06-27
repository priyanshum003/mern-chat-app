
# MERN Chat Application

This project is a real-time chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with TypeScript. It features user authentication, real-time messaging with Socket.IO, and multimedia support including image and GIF sharing via Cloudinary and Giphy.

## Features

- User authentication (register, login, logout)
- Real-time messaging with Socket.IO
- Create group chats
- Multimedia support (images, GIFs)
- File attachment support
- Emoji support

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- TypeScript
- JSON Web Tokens (JWT)
- Cloudinary

### Frontend

- React.js
- TypeScript
- Vite
- Ant Design
- Tailwind CSS
- Socket.IO Client
- Giphy API

## Installation

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/priyanshum003/mern-chat-app.git
cd mern-chat-app/server
``` 

2.  Install dependencies:

`npm install` 

3.  Create a `.env` file in the `server` directory and add the following:
```
PORT=
MONGO_URI=
MONGO_DB_NAME=mern-chat-app
JWT_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
``` 

4.  Start the server :

`npm run dev` 

### Frontend Setup

1.  Navigate to the `client` directory:

`cd ../client` 

2.  Install dependencies:

`npm install` 

3.  Create a `.env` file in the `client` directory and add the following:

`VITE_GIPHY_API_KEY=` 

4.  Start the client:

`npm run dev` 

## Usage

1.  Open your browser and navigate to `http://localhost:3000` for the frontend.
2.  Register a new user or login with an existing account.
3.  Start chatting by selecting an existing chat or creating a new group chat.

## Project Structure

bash

Copy code

```
mern-chat-app/
├── client/         # Frontend application
│   ├── public/     # Public assets
│   ├── src/        # Source files
│   ├── .env        # Environment variables for the client
│   └── ...
├── server/         # Backend application
│   ├── src/        # Source files
│   ├── .env        # Environment variables for the server
│   └── ...
├── README.md       # Project documentation
└── ...
``` 

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.
