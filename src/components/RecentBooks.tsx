import { useBookStore } from '../store/books';
import BookCard from './BookCard';
import { useNavigate } from 'react-router-dom';

/**
 * RecentBooks component
 * Displays the 5 most recently added books
 */
export default function RecentBooks() {
  const books = useBookStore((state) => state.books);
  const navigate = useNavigate();

  // Get the 5 most recently added books (last 5 in array)
  const recentBooks = books.slice(-5).reverse();

  if (recentBooks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Books</h2>
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-gray-600 mb-4">No books in your collection yet</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Recent Books</h2>
        {books.length > 5 && (
          <button
            onClick={() => navigate('/my-books')}
            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            View all →
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {recentBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => navigate(`/book/${book.id}`)}
            showStatus={true}
          />
        ))}
      </div>
    </div>
  );
}
