import { z } from 'zod';

/**
 * Zod schema for ReadingStatus enum validation
 */
export const ReadingStatusSchema = z.enum(['want-to-read', 'currently-reading', 'read']);

/**
 * Zod schema for Book validation
 */
export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  description: z.string(),
  thumbnail: z.string(),
  publishedDate: z.string().optional(),
  pageCount: z.number().optional(),
  categories: z.array(z.string()).optional(),
  status: ReadingStatusSchema,
});

/**
 * Zod schema for User validation
 */
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  createdAt: z.string(),
});

/**
 * Zod schema for Comment validation
 */
export const CommentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  username: z.string(),
  text: z.string(),
  timestamp: z.string(),
});

/**
 * Zod schema for FeedPost validation
 */
export const FeedPostSchema = z.object({
  id: z.string(),
  userId: z.string(),
  username: z.string(),
  book: BookSchema,
  activityType: z.enum(['started-reading', 'finished-reading', 'added-to-collection']),
  timestamp: z.string(),
  likes: z.array(z.string()),
  comments: z.array(CommentSchema),
});

/**
 * Zod schema for BookCollection storage validation
 */
export const BookCollectionStorageSchema = z.object({
  books: z.array(BookSchema),
  searchResults: z.array(BookSchema).optional().default([]),
});

/**
 * Zod schema for User storage validation
 */
export const UserStorageSchema = z.object({
  user: UserSchema.nullable(),
  isAuthenticated: z.boolean(),
});

/**
 * Zod schema for Feed storage validation
 */
export const FeedStorageSchema = z.object({
  posts: z.array(FeedPostSchema),
});

/**
 * Type exports inferred from Zod schemas
 */
export type BookType = z.infer<typeof BookSchema>;
export type UserType = z.infer<typeof UserSchema>;
export type CommentType = z.infer<typeof CommentSchema>;
export type FeedPostType = z.infer<typeof FeedPostSchema>;
export type BookCollectionStorageType = z.infer<typeof BookCollectionStorageSchema>;
export type UserStorageType = z.infer<typeof UserStorageSchema>;
export type FeedStorageType = z.infer<typeof FeedStorageSchema>;
