import { Book, ReadingStatus } from '../types/book';

/**
 * Google Books API response types
 */
interface GoogleBooksVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
}

interface GoogleBooksItem {
  id: string;
  volumeInfo: GoogleBooksVolumeInfo;
}

interface GoogleBooksResponse {
  items?: GoogleBooksItem[];
  totalItems: number;
}

/**
 * API configuration from environment variables
 */
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = import.meta.env.VITE_GOOGLE_BOOKS_BASE_URL || 'https://www.googleapis.com/books/v1';

/**
 * Search for books using Google Books API
 * @param query - Search query string
 * @param maxResults - Maximum number of results to return (default: 20)
 * @returns Promise resolving to array of Book objects
 */
export async function searchBooks(query: string, maxResults: number = 20): Promise<Book[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    // Construct API URL with query parameters
    const url = new URL(`${BASE_URL}/volumes`);
    url.searchParams.append('q', query);
    url.searchParams.append('maxResults', maxResults.toString());

    // Add API key if available
    if (API_KEY) {
      url.searchParams.append('key', API_KEY);
    }

    // Make API request
    const response = await fetch(url.toString());

    // Handle rate limiting
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Handle other HTTP errors
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleBooksResponse = await response.json();

    // Return empty array if no results
    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Map Google Books API response to Book interface
    const books: Book[] = data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title || 'Unknown Title',
      authors: item.volumeInfo.authors || ['Unknown Author'],
      description: item.volumeInfo.description || 'No description available.',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail ||
                 item.volumeInfo.imageLinks?.smallThumbnail ||
                 '/placeholder-book.png',
      publishedDate: item.volumeInfo.publishedDate,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories,
      status: ReadingStatus.WantToRead // Default status for search results
    }));

    return books;
  } catch (error) {
    // Log error for debugging
    console.error('Google Books API error:', error);

    // Re-throw with user-friendly message
    if (error instanceof Error) {
      throw new Error(`Failed to search books: ${error.message}`);
    }
    throw new Error('Failed to search books. Please try again.');
  }
}

/**
 * Get detailed information about a specific book by ID
 * @param bookId - Google Books volume ID
 * @returns Promise resolving to Book object
 */
export async function getBookById(bookId: string): Promise<Book> {
  if (!bookId) {
    throw new Error('Book ID is required');
  }

  try {
    // Construct API URL
    const url = new URL(`${BASE_URL}/volumes/${bookId}`);

    // Add API key if available
    if (API_KEY) {
      url.searchParams.append('key', API_KEY);
    }

    // Make API request
    const response = await fetch(url.toString());

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const item: GoogleBooksItem = await response.json();

    // Map to Book interface
    const book: Book = {
      id: item.id,
      title: item.volumeInfo.title || 'Unknown Title',
      authors: item.volumeInfo.authors || ['Unknown Author'],
      description: item.volumeInfo.description || 'No description available.',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail ||
                 item.volumeInfo.imageLinks?.smallThumbnail ||
                 '/placeholder-book.png',
      publishedDate: item.volumeInfo.publishedDate,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories,
      status: ReadingStatus.WantToRead
    };

    return book;
  } catch (error) {
    console.error('Google Books API error:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to fetch book details: ${error.message}`);
    }
    throw new Error('Failed to fetch book details. Please try again.');
  }
}

/**
 * Get book recommendations based on a query (e.g., genre, author)
 * @param query - Recommendation query (genre, author, etc.)
 * @param maxResults - Maximum number of results to return (default: 8)
 * @returns Promise resolving to array of Book objects
 */
export async function getRecommendations(query: string, maxResults: number = 8): Promise<Book[]> {
  // Use the search function with a specific query structure for recommendations
  return searchBooks(`subject:${query}`, maxResults);
}
