# WalletZen Security Specification

## Data Invariants
1. A transaction must belong to the authenticated user (`userId == auth.uid`).
2. A budget must belong to the authenticated user.
3. A goal must belong to the authenticated user.
4. Users can only read and write their own documents.
5. Transactions cannot be modified once created (immutable pattern for finance integrity), except for specific fields if needed (though typically finance logs are immutable).
6. Timestamps must be server-generated.

## The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Identity Spoofing**: Create a transaction for a different user ID.
2. **Ghost Field Injection**: Add `isVerified: true` to a transaction payload.
3. **Invalid ID Poisoning**: Use a 2KB string as a transaction ID.
4. **Negative Amount**: Try to create an expense with a negative amount (-500).
5. **Unauthorized Read**: Attempt to read any document in `/users/other-user-id`.
6. **Self-Assigned Admin**: Attempt to create a document in the `admins` collection (if it exists) or add an `isAdmin` field to a user profile.
7. **Bypassing Validation**: Create a transaction without the `category` field.
8. **Stale Timestamp**: Submit a `createdAt` timestamp from 5 days ago instead of `request.time`.
9. **Budget Overflow**: Try to set a budget limit to `NaN` or a non-number type.
10. **Orphaned Row**: Create a transaction without an existing user.
11. **Bulk Scrape**: Attempt to `list` all transactions globally without a user filter.
12. **PII Leak**: Attempt to read the `private` profile of another user.

## Security Rules Draft Strategy
1. Global deny.
2. `isValidId` and `isSignedIn` helpers.
3. Sub-collection scoping under `/users/{uid}`.
4. `isValidTransaction`, `isValidBudget`, `isValidGoal` wrappers.
