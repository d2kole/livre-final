import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  showStatus?: boolean;
}

/**
 * BookCard component
 * Reusable card for displaying book information
 */
export default function BookCard({ book, onClick, showStatus = false }: BookCardProps) {
  const statusLabels = {
    'want-to-read': 'Want to Read',
    'currently-reading': 'Currently Reading',
    'read': 'Read',
  };

  const statusColors = {
    'want-to-read': 'bg-blue-100 text-blue-800',
    'currently-reading': 'bg-yellow-100 text-yellow-800',
    'read': 'bg-teal-100 text-teal-800',
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`View details for ${book.title} by ${book.authors.join(', ')}`}
    >
      {/* Book thumbnail */}
      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-center p-4">
            <svg
              className="w-16 h-16 mx-auto mb-2"
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
            <span className="text-sm">No cover available</span>
          </div>
        )}
      </div>

      {/* Book details */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {book.authors.join(', ')}
        </p>

        {showStatus && (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[book.status]
            }`}
          >
            {statusLabels[book.status]}
          </span>
        )}

        {book.pageCount && (
          <p className="text-xs text-gray-500 mt-2">
            {book.pageCount} pages
          </p>
        )}
      </div>
    </div>
  );
}
