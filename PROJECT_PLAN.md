# 🚀 WebSocket Messenger App - Project Plan & Progress Tracker

**Project Name:** Real-time Messenger Application  
**Start Date:** April 2026  
**Status:** 🟡 In Development

---

## 📋 Project Overview

A feature-rich messenger application similar to Facebook Messenger that enables real-time communication between users with support for one-to-one chats, group conversations, and advanced messaging features.

### 🎯 Core Features (Planned)

1. ✅ User Authentication (Register, Login, Password Reset)
2. ✅ One-to-One Messaging
3. ✅ Group Chat Support
4. ✅ Message Edit & Delete
5. ✅ Friend Requests
6. ✅ User Presence Tracking (Online/Offline)
7. ✅ Typing Indicators
8. ⏳ Message Read Receipts
9. ⏳ User Profiles & Status
10. ⏳ Media Sharing (Images, Files, Videos, Audio)

---

## 🔧 BACKEND STATUS

### ✅ Completed Features

#### 1. User Authentication & Management

- [x] User Registration with email & phone validation
- [x] User Login with JWT token generation
- [x] Password reset via email OTP
- [x] Password update for logged-in users
- [x] User model with profile fields (name, email, phone, avatar, bio, status, lastSeen)
- [x] Password hashing with bcryptjs
- [x] JWT token expiration (7 days)

**Endpoints:**

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
PUT    /api/auth/update-password
```

#### 2. Chat Management

- [x] Create one-to-one chats
- [x] Create group chats with multiple participants
- [x] Fetch user's all chats (sorted by latest activity)
- [x] Track last message in each chat
- [x] Admin control for group chats

**Endpoints:**

```
POST   /api/chats/one-to-one
POST   /api/chats/group
GET    /api/chats/
```

**Request/Response Examples:**

```json
// Create One-to-One Chat
POST /api/chats/one-to-one
{
  "userId": "ObjectId of other user"
}

// Response
{
  "_id": "chatId",
  "isGroup": false,
  "participants": ["userId1", "userId2"],
  "createdAt": "timestamp"
}

// Create Group Chat
POST /api/chats/group
{
  "name": "Project Team",
  "participants": ["userId1", "userId2", "userId3"]
}

// Response
{
  "_id": "chatId",
  "isGroup": true,
  "name": "Project Team",
  "participants": ["userId1", "userId2", "userId3", "currentUserId"],
  "admin": "currentUserId",
  "createdAt": "timestamp"
}

// Get All Chats
GET /api/chats/

// Response
[
  {
    "_id": "chatId",
    "isGroup": false,
    "participants": [
      { "_id": "userId", "name": "John", "avatar": "url", "email": "john@example.com" }
    ],
    "lastMessage": {
      "_id": "messageId",
      "content": "Last message text",
      "sender": { "_id": "userId", "name": "John", "avatar": "url" },
      "createdAt": "timestamp"
    },
    "updatedAt": "timestamp"
  }
]
```

#### 3. Message Management

- [x] Send messages in chats (with security check)
- [x] Fetch messages from a chat (paginated - limit 50)
- [x] Edit messages (only by sender)
- [x] Delete messages (only by sender)
- [x] Message metadata (type: text/image/file/video/audio)
- [x] Track message status (seenBy, deliveredTo, edited, deleted)

**Endpoints:**

```
POST   /api/messages/
GET    /api/messages/:chatId
PUT    /api/messages/:id
DELETE /api/messages/:id
```

**Message Model:**

```json
{
  "_id": "messageId",
  "chat": "chatId",
  "sender": "userId",
  "content": "message text or media data",
  "type": "text|image|file|video|audio",
  "seenBy": ["userId1", "userId2"],
  "deliveredTo": ["userId1", "userId2"],
  "edited": false,
  "deleted": false,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### 4. Friend Request System

- [x] Send friend requests (with duplicate prevention)
- [x] Accept/Reject friend requests
- [x] Fetch pending friend requests
- [x] Prevent bidirectional duplicate requests

**Endpoints:**

```
POST   /api/requests/
PUT    /api/requests/:id
GET    /api/requests/
```

**Friend Request Model:**

```json
{
  "_id": "requestId",
  "from": "senderId",
  "to": "receiverId",
  "status": "pending|accepted|rejected",
  "createdAt": "timestamp"
}
```

#### 5. Real-Time Socket.IO Features

- [x] User authentication via socket middleware
- [x] Message sending via sockets with persistence
- [x] Message editing via sockets
- [x] Message deletion via sockets
- [x] Typing indicators (typing:start / typing:stop)
- [x] User presence tracking (online/offline)
- [x] Last seen timestamp tracking
- [x] Online users map management

**Socket Events:**

**Server → Client:**

```javascript
// Message Events
"message:new"; // { _id, chat, sender: {name, avatar}, content, createdAt }
"message:edited"; // { _id, content, edited: true }
"message:deleted"; // { messageId, chatId }

// Typing Events
"typing:started"; // { userId, name }
"typing:stopped"; // { userId }

// Presence Events
"user:online"; // { userId }
"user:offline"; // { userId, lastSeen }
```

**Client → Server:**

```javascript
// Message Events
"chat:join"; // chatId - join a chat room
"message:send"; // { chatId, content }
"message:edit"; // { messageId, newContent }
"message:delete"; // { messageId }

// Typing Events
"typing:start"; // chatId
"typing:stop"; // chatId
```

#### 6. Middleware & Security

- [x] JWT authentication middleware for Express routes
- [x] Socket.IO authentication middleware
- [x] Authorization checks (user can only access their own data)
- [x] Participant verification for chat access
- [x] Sender verification for message edit/delete

---

### ⏳ Remaining Backend Tasks

- [ ] **Read Receipts** - Track when messages are read by recipients
  - Add read receipt socket event: "message:read"
  - Update Message model with readBy array
- [ ] **User Profile Update Endpoint**
  - PUT /api/users/:id - Update avatar, bio, name, phone
  - Add validation and file upload handling
- [ ] **Search Functionality**
  - GET /api/chats/search?q=searchTerm - Search chats by name
  - GET /api/users/search?q=searchTerm - Search users
- [ ] **Message Pagination**
  - Add limit & skip query parameters to getMessages
  - Implement infinite scroll support
- [ ] **Media Handling**
  - Set up file upload endpoint
  - Implement cloudinary/AWS S3 integration
  - POST /api/upload - Handle image/video/audio/file uploads
- [ ] **Group Chat Features**
  - Remove participant from group
  - Leave group functionality
  - Update group name/description
  - Add participant to existing group
- [ ] **Message Reactions/Emojis**
  - Add reactions array to Message model
  - Socket event for adding/removing reactions
- [ ] **Database Indexing & Optimization**
  - Add more indexes for frequently queried fields
  - Optimize pagination queries
- [ ] **Error Handling & Validation**
  - Improve error messages
  - Add request validation middleware
  - Add rate limiting

- [ ] **Testing**
  - Unit tests for controllers
  - Integration tests for API endpoints
  - Socket event tests

---

## 📡 API DATA CONTRACT

### Authentication Response Format

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "avatar": "image_url",
    "bio": "user bio",
    "status": "online|offline",
    "lastSeen": "timestamp"
  }
}
```

### Error Response Format

```json
{
  "message": "Error description",
  "error": "error details"
}
```

### Socket Response Format

All socket events use this general structure:

```json
{
  "success": true/false,
  "data": { /* event specific data */ },
  "error": "error message if applicable"
}
```

---

## 🎨 FRONTEND STATUS

### 📦 Project Setup

- [x] Next.js 16 with TypeScript
- [x] React 19 with React-DOM 19
- [x] Tailwind CSS v4
- [x] Basic layout structure

### ✅ Completed

- [x] Basic Next.js project initialization
- [x] Tailwind CSS configuration
- [x] TypeScript configuration
- [x] Layout component (global styles, fonts)

### 🚀 Frontend Architecture Plan

#### **Page Structure**

```
/client/app/
├── layout.tsx                 # Root layout (DONE)
├── page.tsx                   # Landing/Auth page (TODO)
├── (auth)/
│   ├── login/page.tsx         # Login form
│   ├── register/page.tsx      # Registration form
│   └── forgot-password/page.tsx # Password reset
├── (app)/
│   ├── layout.tsx             # App layout with sidebar
│   ├── chats/page.tsx         # Chats list & chat window
│   ├── users/page.tsx         # Users directory
│   ├── friends/page.tsx       # Friend requests
│   └── profile/page.tsx       # User profile & settings
```

#### **Component Structure**

```
/client/app/components/
├── auth/
│   ├── LoginForm.tsx          # Login component
│   ├── RegisterForm.tsx       # Registration component
│   └── PasswordReset.tsx      # Password reset form
├── chat/
│   ├── ChatList.tsx           # List of chats (sidebar)
│   ├── ChatWindow.tsx         # Main chat area
│   ├── MessageList.tsx        # Messages display
│   ├── MessageInput.tsx       # Message input field
│   ├── MessageItem.tsx        # Single message component
│   ├── TypingIndicator.tsx    # Typing indicator animation
│   └── GroupChatSettings.tsx  # Group settings
├── common/
│   ├── Header.tsx             # Top navigation
│   ├── Sidebar.tsx            # Left sidebar
│   ├── Avatar.tsx             # User avatar component
│   ├── UserCard.tsx           # User info card
│   └── Button.tsx             # Reusable button
└── user/
    ├── UserProfile.tsx        # User profile view
    ├── FriendRequests.tsx      # Friend requests list
    └── UserSearch.tsx         # Search users
```

#### **Hooks/Context**

```
/client/app/hooks/
├── useAuth.ts                # Authentication context & logic
├── useChat.ts                # Chat management
├── useSocket.ts              # WebSocket connection
├── useMessages.ts            # Message state management
└── useFriends.ts             # Friend management

/client/app/context/
├── AuthContext.tsx           # Auth state provider
├── SocketContext.tsx         # Socket.IO provider
└── ChatContext.tsx           # Chat state provider
```

#### **Utilities**

```
/client/app/lib/
├── socket.ts                 # Socket.IO client setup
├── api.ts                    # API request helpers
├── auth.ts                   # Auth utilities (JWT storage)
├── validators.ts             # Form validation
└── constants.ts              # App constants
```

---

## 🎯 FRONTEND IMPLEMENTATION CHECKLIST

### 1️⃣ **Authentication Pages** ⏳

- [ ] Login Page
  - [ ] Email input field
  - [ ] Password input field
  - [ ] Login button
  - [ ] Forgot password link
  - [ ] Register link
  - [ ] Error handling & display
  - [ ] Loading state
  - [ ] Token storage in localStorage
  - [ ] Redirect on successful login

- [ ] Register Page
  - [ ] Name input field
  - [ ] Email input field
  - [ ] Phone input field (optional)
  - [ ] Password input field
  - [ ] Password confirmation field
  - [ ] Register button
  - [ ] Validation (email format, password strength)
  - [ ] Error handling
  - [ ] Success redirect to login/dashboard
  - [ ] Login link

- [ ] Forgot Password Page
  - [ ] Email input
  - [ ] Send OTP button
  - [ ] OTP input field
  - [ ] New password input
  - [ ] Confirm password input
  - [ ] Reset button
  - [ ] Success message

### 2️⃣ **Chat Interface** ⏳

- [ ] Chat List / Sidebar
  - [ ] Display all user chats
  - [ ] Show last message preview
  - [ ] Show user avatars
  - [ ] Show timestamps
  - [ ] Highlight active chat
  - [ ] Search chats functionality
  - [ ] Create new chat button
  - [ ] Create group button

- [ ] Main Chat Window
  - [ ] Chat header with user/group info
  - [ ] Display all messages in chat
  - [ ] Message timestamp
  - [ ] Sender information
  - [ ] Read receipts (seen by indicator)
  - [ ] Message status (sent, delivered, read)
  - [ ] Edit message button
  - [ ] Delete message button
  - [ ] Scroll to latest message
  - [ ] Infinite scroll for older messages

- [ ] Message Input Area
  - [ ] Text input field
  - [ ] Send button
  - [ ] Typing indicator (show others you're typing)
  - [ ] Attachment button (for future media)
  - [ ] Emoji picker (optional)
  - [ ] Auto-expand input as you type

- [ ] Typing Indicators
  - [ ] Show "User is typing..." indicator
  - [ ] Hide after user stops typing
  - [ ] Animation/pulse effect

### 3️⃣ **Users & Friends** ⏳

- [ ] Users Directory Page
  - [ ] List all users
  - [ ] Search users by name
  - [ ] Show user avatars
  - [ ] Show online/offline status
  - [ ] Send friend request button
  - [ ] Start chat button (if already friends)

- [ ] Friend Requests Page
  - [ ] Pending requests received
  - [ ] Pending requests sent
  - [ ] Accept button
  - [ ] Reject button
  - [ ] Cancel sent request button
  - [ ] Show requester info (name, avatar)

- [ ] User Profile Page
  - [ ] Display user info (name, email, phone, bio, avatar)
  - [ ] Edit profile button
  - [ ] Change avatar
  - [ ] Update bio
  - [ ] Update phone
  - [ ] Online status
  - [ ] Last seen timestamp
  - [ ] Logout button

### 4️⃣ **Real-Time Features** ⏳

- [ ] Socket.IO Connection
  - [ ] Connect on app load with auth token
  - [ ] Auto-reconnect on disconnect
  - [ ] Show connection status

- [ ] Real-Time Messages
  - [ ] Listen to "message:new" event
  - [ ] Display new messages instantly
  - [ ] Display edited messages
  - [ ] Display deleted messages
  - [ ] Sound notification (optional)

- [ ] Presence Tracking
  - [ ] Show online/offline status
  - [ ] Update status when user comes online/goes offline
  - [ ] Show "last seen" time for offline users

- [ ] Typing Indicators
  - [ ] Emit "typing:start" on focus
  - [ ] Emit "typing:stop" on blur/send
  - [ ] Display typing indicator for others

### 5️⃣ **Group Chat Features** ⏳

- [ ] Create Group
  - [ ] Group name input
  - [ ] Multi-select participants
  - [ ] Create button
  - [ ] Success confirmation

- [ ] Group Settings
  - [ ] Show group members
  - [ ] Show group admin
  - [ ] Leave group button (for non-admin)
  - [ ] Remove member button (admin only)
  - [ ] Change group name (admin only)
  - [ ] Group description (admin only)

### 6️⃣ **UI/UX Polish** ⏳

- [ ] Responsive Design
  - [ ] Mobile layout (< 768px)
  - [ ] Tablet layout (768px - 1024px)
  - [ ] Desktop layout (> 1024px)
  - [ ] Hamburger menu on mobile

- [ ] Loading States
  - [ ] Loading spinner for messages
  - [ ] Loading spinner for chats
  - [ ] Skeleton screens (optional)

- [ ] Error Handling
  - [ ] Toast notifications for errors
  - [ ] Toast notifications for success
  - [ ] Error boundaries
  - [ ] Fallback UI

- [ ] Accessibility
  - [ ] Keyboard navigation
  - [ ] ARIA labels
  - [ ] Focus management
  - [ ] Screen reader support

---

## 📊 DATA FLOW (Frontend ↔ Backend)

### **User Login Flow**

```
Frontend: POST /api/auth/login
  ↓
{email, password}
  ↓
Backend: Validates credentials, generates JWT
  ↓
Response: {token, user}
  ↓
Frontend: Store token in localStorage, Connect WebSocket
  ↓
Display: Redirect to /chats
```

### **Create Chat Flow**

```
Frontend: User clicks "New Chat" or selects user
  ↓
POST /api/chats/one-to-one {userId}
  ↓
Backend: Creates/fetches chat
  ↓
Response: {chatId, participants, lastMessage}
  ↓
Frontend: Display chat window, join socket room
  ↓
Socket: Emit "chat:join" {chatId}
```

### **Send Message Flow**

```
Frontend: User types message, hits send
  ↓
Socket: Emit "message:send" {chatId, content}
  ↓
Backend: Create message, save to DB, update chat
  ↓
Socket: Broadcast "message:new" to all chat participants
  ↓
Frontend: Display message in chat window
```

### **Edit Message Flow**

```
Frontend: User clicks "Edit", modifies text
  ↓
PUT /api/messages/{messageId} {content}
  ↓
Backend: Updates message, marks as edited
  ↓
Response: Updated message object
  ↓
Also Socket: Emit "message:edit" {messageId, content}
  ↓
Frontend: Update message display with "edited" label
```

### **Typing Indicator Flow**

```
Frontend: User starts typing
  ↓
Socket: Emit "typing:start" {chatId}
  ↓
Backend: Broadcast to room
  ↓
Socket: All other participants receive "typing:started"
  ↓
Frontend: Show "User is typing..." indicator
  ↓
(After 2 seconds of no input)
  ↓
Frontend: Emit "typing:stop" {chatId}
  ↓
Backend: Broadcast to room
  ↓
Socket: "typing:stopped" event
  ↓
Frontend: Hide typing indicator
```

---

## 🔄 PROGRESS TRACKING

### Weekly Checklist Template

Use this to track weekly progress:

```markdown
## Week 1 (April 24-30, 2026)

### Backend

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

Progress: 0/10 tasks

### Frontend

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

Progress: 0/10 tasks

### Blockers

- None yet

### Notes

-
```

---

## 📝 CURRENT STATUS SUMMARY

| Component                            | Status         | Progress |
| ------------------------------------ | -------------- | -------- |
| **Backend - Auth**                   | ✅ Complete    | 100%     |
| **Backend - Chat**                   | ✅ Complete    | 100%     |
| **Backend - Messages**               | ✅ Complete    | 100%     |
| **Backend - Friends**                | ✅ Complete    | 100%     |
| **Backend - Real-Time (Socket)**     | ✅ Complete    | 100%     |
| **Frontend - Project Setup**         | ✅ Complete    | 100%     |
| **Frontend - Auth Pages**            | ⏳ Not Started | 0%       |
| **Frontend - Chat UI**               | ⏳ Not Started | 0%       |
| **Frontend - Real-Time Features**    | ⏳ Not Started | 0%       |
| **Frontend - Polish & Optimization** | ⏳ Not Started | 0%       |
| **Deployment**                       | ⏳ Not Started | 0%       |
| **Documentation**                    | 🟡 In Progress | 50%      |

---

## 🚦 Next Steps

### Immediate (This Week)

1. [ ] Create auth context and utilities
2. [ ] Build login page component
3. [ ] Build register page component
4. [ ] Implement API helper functions
5. [ ] Set up Socket.IO client hook

### Short Term (Next 2 Weeks)

1. [ ] Create chat list component
2. [ ] Create message display component
3. [ ] Create message input component
4. [ ] Implement real-time message sending
5. [ ] Implement typing indicators

### Medium Term (Next Month)

1. [ ] Complete group chat features
2. [ ] Add media sharing
3. [ ] Implement read receipts
4. [ ] Add user search functionality
5. [ ] Profile management pages

### Long Term

1. [ ] Performance optimization
2. [ ] Testing & QA
3. [ ] Deployment to production
4. [ ] Feature monitoring
5. [ ] User feedback collection

---

## 🔗 Useful Resources

### API Base URL

- **Development:** `http://localhost:8080/api`
- **WebSocket URL:** `ws://localhost:8080`

### Environment Variables

**Frontend (.env.local):**

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

**Backend (.env):**

```
PORT=8080
JWT_SECRET=your_secret_key
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Key Technologies

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Socket.IO Client
- **Backend:** Express, MongoDB, Socket.IO, JWT, Nodemailer
- **Database:** MongoDB with Mongoose ODM
- **Real-Time:** Socket.IO for WebSocket communication

---

**Last Updated:** April 24, 2026  
**Maintained By:** Development Team  
**Note:** This document should be updated regularly as features are completed.
