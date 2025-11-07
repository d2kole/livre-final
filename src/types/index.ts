/**
 * Central export file for all TypeScript types and interfaces
 */

// Book types
export type { Book, BookCollectionState } from './book';
export { ReadingStatus } from './book';

// User types
export type { User, UserState } from './user';

// Feed types
export type { FeedPost, Comment, FeedState } from './feed';

// Re-export Zod schemas and their inferred types
export {
  BookSchema,
  UserSchema,
  CommentSchema,
  FeedPostSchema,
  BookCollectionStorageSchema,
  UserStorageSchema,
  FeedStorageSchema,
  ReadingStatusSchema,
  type BookType,
  type UserType,
  type CommentType,
  type FeedPostType,
  type BookCollectionStorageType,
  type UserStorageType,
  type FeedStorageType,
} from '../schemas/storage';
