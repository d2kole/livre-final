import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState, User } from '../types/user';

/**
 * Zustand store for user authentication and profile management
 * Persists to LocalStorage with key: codex:v1:user
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      /**
       * Login user with username (no password required)
       * Creates a new user object with id, username, and createdAt timestamp
       */
      login: (username: string) => {
        const user: User = {
          id: crypto.randomUUID(),
          username: username.trim(),
          createdAt: new Date().toISOString(),
        };

        set({
          user,
          isAuthenticated: true,
        });
      },

      /**
       * Logout user and clear authentication state
       */
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'codex:v1:user',
    }
  )
);
