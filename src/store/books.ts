import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookCollectionState, Book, ReadingStatus, NotificationType } from '../types';
import { useNotificationStore } from './notifications';

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
        set((state) => {
          const book = state.books.find((b) => b.id === bookId);

          // Trigger notification when book is marked as read
          if (book && status === ReadingStatus.Read && book.status !== ReadingStatus.Read) {
            const { addNotification } = useNotificationStore.getState();
            addNotification({
              type: NotificationType.BookRead,
              title: 'Book Completed! 🎉',
              message: `You finished reading "${book.title}"`,
              bookId: book.id,
              bookTitle: book.title,
            });
          }

          return {
            books: state.books.map((b) =>
              b.id === bookId ? { ...b, status } : b
            ),
          };
        });
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
