
# Real-Time Chat Application API

## Base URL

`http://localhost:5000/api`

## Authentication

### Register User

**Endpoint**: `POST /users/register`

**Description**: Register a new user.

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response**:
- **201 Created**:
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "token": "string"
  }
  ```
- **400 Bad Request**:
  ```json
  {
    "success": false,
    "message": "User already exists"
  }
  ```

### Login User

**Endpoint**: `POST /users/login`

**Description**: Authenticate a user and return a JWT token.

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
- **200 OK**:
  ```json
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "token": "string"
  }
  ```
- **400 Bad Request**:
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

## Chats

### Create Chat

**Endpoint**: `POST /chats`

**Description**: Create a new chat (1v1 or group).

**Request Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "users": ["string"],
  "isGroupChat": "boolean",
  "chatName": "string",
  "groupAdmin": "string"
}
```

**Response**:
- **201 Created**:
  ```json
  {
    "_id": "string",
    "users": ["string"],
    "isGroupChat": "boolean",
    "chatName": "string",
    "groupAdmin": "string"
  }
  ```
- **200 OK** (if chat already exists):
  ```json
  {
    "success": true,
    "message": "Chat already exists",
    "data": {
      "_id": "string",
      "users": ["string"],
      "isGroupChat": "boolean",
      "chatName": "string",
      "groupAdmin": "string"
    }
  }
  ```

### Get Chats

**Endpoint**: `GET /chats`

**Description**: Retrieve all chats for the logged-in user.

**Request Headers**:
```
Authorization: Bearer <token>
```

**Response**:
- **200 OK**:
  ```json
  [
    {
      "_id": "string",
      "users": [
        {
          "_id": "string",
          "name": "string",
          "email": "string"
        }
      ],
      "isGroupChat": "boolean",
      "chatName": "string",
      "groupAdmin": {
        "_id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ]
  ```

## Messages

### Send Message

**Endpoint**: `POST /messages`

**Description**: Send a new message to a chat.

**Request Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "content": "string",
  "chatId": "string"
}
```

**Response**:
- **201 Created**:
  ```json
  {
    "_id": "string",
    "sender": "string",
    "content": "string",
    "chatId": "string",
    "createdAt": "timestamp"
  }
  ```

### Get Messages

**Endpoint**: `GET /messages/:chatId`

**Description**: Retrieve all messages for a specific chat.

**Request Headers**:
```
Authorization: Bearer <token>
```

**Response**:
- **200 OK**:
  ```json
  [
    {
      "_id": "string",
      "sender": {
        "_id": "string",
        "name": "string",
        "email": "string"
      },
      "content": "string",
      "chatId": "string",
      "createdAt": "timestamp"
    }
  ]
  ```

## Error Handling

### Common Errors

**400 Bad Request**:
```json
{
  "success": false,
  "message": "string"
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Server error"
}
```

### Example Error Response

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```
