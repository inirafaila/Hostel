/**
 * Marker interface to enforce compile-safe transport of database transaction state
 * across repository boundaries without tying domain logic to a specific ORM.
 */
export interface ITransactionContext {
  // e.g., could hold a Prisma Client instance or pg connection later
  isTransaction: true;
}
