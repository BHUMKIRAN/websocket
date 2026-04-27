/**
 * CHATS PAGE
 * Route: /app/chats
 *
 * TODO: Implement the following features:
 * - [ ] Two-column layout (ChatList + ChatWindow)
 * - [ ] Fetch and display all chats using useChat hook
 * - [ ] Show chat list with user avatars
 * - [ ] Show last message preview in each chat
 * - [ ] Show timestamps in chats
 * - [ ] Highlight currently active chat
 * - [ ] Click on chat to open ChatWindow
 * - [ ] "New Chat" button to create one-to-one chat
 * - [ ] "Create Group" button to create group chat
 * - [ ] Search chats functionality (search bar)
 * - [ ] Real-time message updates (Socket.IO)
 * - [ ] Show unread message indicator (if implemented)
 * - [ ] Handle empty state (no chats yet)
 * - [ ] Loading state for chats
 * - [ ] Responsive design (mobile should hide list on message open)
 * - [ ] ChatList component renders list
 * - [ ] ChatWindow component renders selected chat messages
 * - [ ] Socket event listeners for message:new, message:edited, message:deleted
 * - [ ] Typing indicators in chat window
 */

import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import GroupChatSettings from "@/components/chat/GroupChatSettings";

export default function ChatsPage() {
  return (
    <div className="grid grid-cols-3">
      <ChatList />
      <ChatWindow/>
      <div>
        <GroupChatSettings/>
      </div>
    </div>
  );
}
