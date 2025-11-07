import { useState } from 'react';
import { Book, ReadingStatus } from '../types';
import { useBookStore } from '../store/books';

interface SearchBookCardProps {
  book: Book;
}

/**
 * SearchBookCard component
 * Displays book search results with "Add to Collection" functionality
 */
export default function SearchBookCard({ book }: SearchBookCardProps) {
  const { addBook, books } = useBookStore();
  const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>(ReadingStatus.WantToRead);
  const [isAdded, setIsAdded] = useState(books.some(b => b.id === book.id));

  const statusLabels = {
    [ReadingStatus.WantToRead]: 'Want to Read',
    [ReadingStatus.CurrentlyReading]: 'Currently Reading',
    [ReadingStatus.Read]: 'Read',
  };

  const handleAddToCollection = () => {
    const bookWithStatus = { ...book, status: selectedStatus };
    addBook(bookWithStatus);
    setIsAdded(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
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

        {book.publishedDate && (
          <p className="text-xs text-gray-500 mb-2">
            Published: {new Date(book.publishedDate).getFullYear()}
          </p>
        )}

        {book.pageCount && (
          <p className="text-xs text-gray-500 mb-3">
            {book.pageCount} pages
          </p>
        )}

        {/* Add to Collection section */}
        <div className="mt-4 space-y-2">
          {!isAdded ? (
            <>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ReadingStatus)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Select reading status"
              >
                <option value={ReadingStatus.WantToRead}>
                  {statusLabels[ReadingStatus.WantToRead]}
                </option>
                <option value={ReadingStatus.CurrentlyReading}>
                  {statusLabels[ReadingStatus.CurrentlyReading]}
                </option>
                <option value={ReadingStatus.Read}>
                  {statusLabels[ReadingStatus.Read]}
                </option>
              </select>
              <button
                onClick={handleAddToCollection}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                aria-label={`Add ${book.title} to collection`}
              >
                Add to Collection
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center py-2 text-teal-600">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Added to Collection</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
