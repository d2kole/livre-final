/**
 * User interface for authentication and profile
 */
export interface User {
  id: string;
  username: string;
  createdAt: string;
}

/**
 * User state interface for Zustand store
 */
export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
}
