import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FeedState, FeedPost, Comment } from '../types/feed';

/**
 * Zustand store for social feed management with LocalStorage persistence
 */
export const useFeedStore = create<FeedState>()(
  persist(
    (set) => ({
      posts: [],

      addPost: (post: Omit<FeedPost, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
        const newPost: FeedPost = {
          ...post,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          likes: [],
          comments: [],
        };
        set(state => ({
          posts: [newPost, ...state.posts],
        }));
      },

      likePost: (postId: string, userId: string) => {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId && !post.likes.includes(userId)
              ? { ...post, likes: [...post.likes, userId] }
              : post
          ),
        }));
      },

      unlikePost: (postId: string, userId: string) => {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? { ...post, likes: post.likes.filter(id => id !== userId) }
              : post
          ),
        }));
      },

      addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
        const newComment: Comment = {
          ...comment,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          ),
        }));
      },

      removePost: (postId: string) => {
        set(state => ({
          posts: state.posts.filter(post => post.id !== postId),
        }));
      },
    }),
    {
      name: 'codex:v1:feed',
      version: 1,
    }
  )
);
