/**
 * SOCKET CONTEXT
 * Path: context/SocketContext.tsx
 *
 * TODO: Implement the following features:
 * - [ ] Create React Context for Socket.IO
 * - [ ] Define SocketContextType interface:
 *       - [ ] socket: Socket instance
 *       - [ ] isConnected: boolean
 *       - [ ] isConnecting: boolean
 *       - [ ] error: string | null
 * - [ ] Create SocketProvider component
 * - [ ] Initialize Socket.IO connection on mount:
 *       - [ ] Connect to ws://localhost:8080
 *       - [ ] Pass JWT token to auth
 *       - [ ] Handle connection events
 * - [ ] Listen to socket events:
 *       - [ ] "connect" - set isConnected to true
 *       - [ ] "disconnect" - set isConnected to false
 *       - [ ] "connect_error" - set error state
 *       - [ ] "error" - handle errors
 * - [ ] Auto-reconnect logic
 * - [ ] Cleanup on unmount (disconnect socket)
 * - [ ] Provide socket instance to children
 * - [ ] Export useSocketContext hook
 */

export default function SocketContext() {
  return null;
}
