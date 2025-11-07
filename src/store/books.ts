import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookCollectionState, Book, ReadingStatus } from '../types';

/**
 * Zustand store for book collection management
 * Persists to LocalStorage with key: codex:v1:books
 */
export const useBookStore = create<BookCollectionState>()(
  persist(
    (set) => ({
      books: [],
      searchResults: [],

      /**
       * Add a new book to the collection
       */
      addBook: (book: Book) => {
        set((state) => ({
          books: [...state.books, book],
        }));
      },

      /**
       * Remove a book from the collection
       */
      removeBook: (bookId: string) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== bookId),
        }));
      },

      /**
       * Update book reading status
       */
      updateBookStatus: (bookId: string, status: ReadingStatus) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId ? { ...book, status } : book
          ),
        }));
      },

      /**
       * Set search results from Google Books API
       */
      setSearchResults: (results: Book[]) => {
        set({ searchResults: results });
      },

      /**
       * Clear search results
       */
      clearSearchResults: () => {
        set({ searchResults: [] });
      },
    }),
    {
      name: 'codex:v1:books',
    }
  )
);
