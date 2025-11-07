/**
 * Reading status enum for book tracking
 */
export enum ReadingStatus {
  WantToRead = 'want-to-read',
  CurrentlyReading = 'currently-reading',
  Read = 'read'
}

/**
 * Book interface representing a book entity from Google Books API
 */
export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  status: ReadingStatus;
}

/**
 * Book collection state interface for Zustand store
 */
export interface BookCollectionState {
  books: Book[];
  searchResults: Book[];
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  updateBookStatus: (bookId: string, status: ReadingStatus) => void;
  setSearchResults: (results: Book[]) => void;
  clearSearchResults: () => void;
}
