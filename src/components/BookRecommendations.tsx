import { useState, useEffect } from 'react';
import { useBookStore } from '../store/books';
import { Book } from '../types';
import BookCard from './BookCard';
import { searchBooks } from '../services/googleBooks';
import { useNavigate } from 'react-router-dom';

/**
 * BookRecommendations component
 * Displays personalized book recommendations based on user's collection
 */
export default function BookRecommendations() {
  const books = useBookStore((state) => state.books);
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Don't fetch if user has no books
      if (books.length === 0) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get categories from user's books
        const userCategories = books
          .flatMap((book) => book.categories || [])
          .filter((category, index, self) => self.indexOf(category) === index);

        // Get authors from user's books
        const userAuthors = books
          .flatMap((book) => book.authors)
          .filter((author, index, self) => self.indexOf(author) === index);

        // Build recommendation query (prefer categories, fallback to authors)
        const query = userCategories.length > 0
          ? userCategories[0]
          : userAuthors[0] || 'bestseller';

        // Fetch recommendations from Google Books API
        const results = await searchBooks(query);

        // Filter out books already in user's collection
        const bookIds = new Set(books.map((b) => b.id));
        const newRecommendations = results
          .filter((book) => !bookIds.has(book.id))
          .slice(0, 5);

        setRecommendations(newRecommendations);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError('Unable to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [books]);

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommendations</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">
            Add books to your collection to get personalized recommendations!
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommendations</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" aria-label="Loading recommendations" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommendations</h2>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommendations</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">
            No recommendations available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
        <button
          onClick={() => navigate('/browse')}
          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
        >
          Browse more →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {recommendations.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => navigate(`/book/${book.id}`)}
            showStatus={false}
          />
        ))}
      </div>
    </div>
  );
}
