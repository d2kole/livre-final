import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user';

/**
 * LoginPage component
 * Simple username-only authentication with form validation
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();

  /**
   * Handle form submission
   * Validates username and logs user in
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation: Required field
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    // Validation: Minimum 3 characters
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    // Login and redirect to dashboard
    login(username);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Codex Collective
            </h1>
            <p className="text-gray-600">
              Discover, track, and share your reading journey
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  error
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-teal-500'
                }`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'username-error' : undefined}
                autoFocus
              />
              {error && (
                <p
                  id="username-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Get Started
            </button>
          </form>

          {/* Info Text */}
          <p className="text-center text-sm text-gray-500">
            No password required - just pick a username to begin
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Built with ❤️ for book lovers
        </p>
      </div>
    </div>
  );
}
