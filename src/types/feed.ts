import { Book } from './book';

/**
 * Comment interface for feed posts
 */
export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}

/**
 * Feed post interface for social activity stream
 */
export interface FeedPost {
  id: string;
  userId: string;
  username: string;
  book: Book;
  activityType: 'started-reading' | 'finished-reading' | 'added-to-collection';
  timestamp: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
}

/**
 * Feed state interface for Zustand store
 */
export interface FeedState {
  posts: FeedPost[];
  addPost: (post: Omit<FeedPost, 'id' | 'likes' | 'comments' | 'timestamp'>) => void;
  likePost: (postId: string, userId: string) => void;
  unlikePost: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  removePost: (postId: string) => void;
}
