/**
 * useFriends HOOK
 * Path: hooks/useFriends.ts
 *
 * TODO: Implement the following features:
 * - [ ] Get friend requests from context
 * - [ ] Get pending requests received
 * - [ ] Get pending requests sent
 * - [ ] Get loading/error states
 * - [ ] Fetch friend requests function:
 *       - [ ] GET /api/requests/
 *       - [ ] Get all pending requests
 *       - [ ] Set in context
 *       - [ ] Handle errors
 * - [ ] Send friend request function:
 *       - [ ] POST /api/requests/ {to: userId}
 *       - [ ] Add to sent requests
 *       - [ ] Handle duplicate request error
 *       - [ ] Handle errors
 * - [ ] Accept friend request function:
 *       - [ ] PUT /api/requests/:id {action: "accept"}
 *       - [ ] Remove from received requests
 *       - [ ] Add to friends list
 *       - [ ] Handle errors
 * - [ ] Reject friend request function:
 *       - [ ] PUT /api/requests/:id {action: "reject"}
 *       - [ ] Remove from received requests
 *       - [ ] Handle errors
 * - [ ] Cancel friend request function:
 *       - [ ] DELETE /api/requests/:id
 *       - [ ] Remove from sent requests
 *       - [ ] Handle errors
 * - [ ] Search users function
 * - [ ] Get all users function
 * - [ ] Return hook object with all above
 */

export default function useFriends() {
  return {};
}
