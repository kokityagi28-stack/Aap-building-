# Security Specification: Creator Marketplace

## 1. Data Invariants
- A **Portfolio** must belong to a user with the `creator` role.
- A **Review** must be written by a user with the `client` role (or eventually any authenticated user who has hired the creator).
- **Messages** are only readable/writable by the specified `senderId` and `receiverId`.
- **Likes** and **Follows** are unique per user-resource pair.
- **Role** is immutable after creation (unless by admin).
- **Rating** in `Review` must be between 1 and 5.

## 2. The "Dirty Dozen" Payloads
1. **Identity Theft**: Create a portfolio item with `creatorId` set to another user's UID.
2. **Role Escalation**: Update own user profile to change `role` from 'client' to 'creator' (if role-based permissions exist for specific actions).
3. **Ghost Post**: Create a portfolio item with a 1MB string in the `title` field.
4. **Relationship Poisoning**: Inject a malicious string into a `portfolioId` or `userId`.
5. **Rating Manipulation**: Submit a review with a rating of 100.
6. **Interaction Spam**: Create 1000 comments on a single portfolio item from a single account (rate limiting logic in rules).
7. **Unauthorized Read**: Attempt to read private conversations between two other users.
8. **Shadow Field**: Update a user profile with a hidden `isAdmin: true` field.
9. **Timestamp Spoofing**: Set `createdAt` to a future date manually.
10. **Follow Loop**: Follow oneself.
11. **Client Delegation Leak**: Perform a blanket `list` on all users without filtering by role or search query.
12. **Orphaned Writes**: Create a review for a non-existent creator.

## 3. Test Runner (Draft)
The tests will verify that:
- `allow create/update` fails if schema/identity/integrity checks fail.
- `allow list` fails if not scoped correctly.

(Integration tests will be implemented in `firestore.rules.test.ts` if needed, but the primary focus is the rules file).
