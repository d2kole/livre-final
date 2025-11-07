import { useBookStore } from '../store/books';
import { ReadingStatus } from '../types';

/**
 * ReadingProgress component
 * Displays reading statistics and progress visualization
 */
export default function ReadingProgress() {
  const books = useBookStore((state) => state.books);

  // Calculate reading statistics
  const stats = {
    wantToRead: books.filter((b) => b.status === ReadingStatus.WantToRead).length,
    currentlyReading: books.filter((b) => b.status === ReadingStatus.CurrentlyReading).length,
    read: books.filter((b) => b.status === ReadingStatus.Read).length,
    total: books.length,
  };

  // Calculate percentage of books read
  const readPercentage = stats.total > 0 ? Math.round((stats.read / stats.total) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Reading Progress</h2>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Books Read</span>
          <span className="text-sm font-medium text-teal-600">{stats.read} / {stats.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-teal-600 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${readPercentage}%` }}
            role="progressbar"
            aria-valuenow={readPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Reading progress: ${readPercentage}%`}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">{readPercentage}% complete</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-3xl font-bold text-blue-600">{stats.wantToRead}</p>
          <p className="text-xs text-gray-600 mt-1">Want to Read</p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-3xl font-bold text-yellow-600">{stats.currentlyReading}</p>
          <p className="text-xs text-gray-600 mt-1">Currently Reading</p>
        </div>
        <div className="text-center p-4 bg-teal-50 rounded-lg">
          <p className="text-3xl font-bold text-teal-600">{stats.read}</p>
          <p className="text-xs text-gray-600 mt-1">Read</p>
        </div>
      </div>

      {/* Encouraging message */}
      {stats.total === 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 text-sm">
            Start adding books to track your reading journey!
          </p>
        </div>
      )}
    </div>
  );
}
