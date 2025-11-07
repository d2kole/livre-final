import { useUserStore } from '../store/user';
import ReadingProgress from '../components/ReadingProgress';
import RecentBooks from '../components/RecentBooks';
import BookRecommendations from '../components/BookRecommendations';

/**
 * DashboardPage component
 * Main landing page after login displaying reading progress, recent books, and recommendations
 */
export default function DashboardPage() {
  const user = useUserStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome back, {user?.username}! 📚
          </h1>
          <p className="text-gray-600 mt-2">
            Track your reading journey and discover new books
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Reading progress section */}
          <section aria-label="Reading progress">
            <ReadingProgress />
          </section>

          {/* Recent books section */}
          <section aria-label="Recent books">
            <RecentBooks />
          </section>

          {/* Recommendations section */}
          <section aria-label="Book recommendations">
            <BookRecommendations />
          </section>
        </div>
      </div>
    </div>
  );
}
