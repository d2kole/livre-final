import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useUserStore } from '../store/user';
import { useNotificationStore } from '../store/notifications';
import { useBookStore } from '../store/books';
import NotificationDropdown from './NotificationDropdown';
import { searchBooks } from '../services/googleBooks';
import { useDebounce } from '../hooks/useDebounce';
import { Book, ReadingStatus } from '../types';

/**
 * Navbar component
 * Main navigation header with links and user profile
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const { unreadCount } = useNotificationStore();
  const { addBook } = useBookStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  const debouncedQuery = useDebounce(searchQuery, 300);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchBooks(debouncedQuery, 8);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddBook = (book: Book) => {
    addBook({ ...book, status: ReadingStatus.WantToRead });
    setSearchQuery('');
    setShowSearchResults(false);
    navigate('/my-books');
  };

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/my-books', label: 'My Books' },
    { path: '/browse', label: 'Browse' },
    { path: '/feed', label: 'Community' },
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f1f3] px-6 lg:px-10 py-3 bg-white">
      {/* Logo and Navigation Links */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-[#0e191b]">
          <div className="w-8 h-8">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-[#0e191b] text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">
            Codex Collective
          </h2>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium leading-normal transition-colors ${
                isActive(link.path)
                  ? 'text-[#2E8B57] border-b-2 border-[#2E8B57] pb-1'
                  : 'text-[#0e191b] hover:text-[#2E8B57]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right Side: Search, Notifications, User Profile */}
      <div className="flex flex-1 justify-end items-center gap-3 lg:gap-4">
        {/* Search Bar - Hidden on small screens */}
        <div ref={searchRef} className="hidden lg:flex relative min-w-40 max-w-64">
          <label className="flex flex-col h-10 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-[#4e8b97] flex border-none bg-[#e7f1f3] items-center justify-center pl-4 rounded-l-xl border-r-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e191b] focus:outline-0 focus:ring-0 border-none bg-[#e7f1f3] focus:border-none h-full placeholder:text-[#4e8b97] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                aria-label="Search for books"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="animate-spin h-4 w-4 text-[#4e8b97]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </label>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((book) => (
                    <div
                      key={book.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleAddBook(book)}
                    >
                      <div className="flex gap-3">
                        {book.thumbnail ? (
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {book.title}
                          </h4>
                          <p className="text-xs text-gray-600 truncate">
                            {book.authors.join(', ')}
                          </p>
                          <p className="text-xs text-[#2E8B57] mt-1">
                            Click to add to My Books
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {searchQuery && (
                    <Link
                      to="/browse"
                      className="block px-4 py-3 text-center text-sm text-[#2E8B57] hover:bg-gray-50 font-medium border-t border-gray-200"
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                    >
                      View all results in Browse
                    </Link>
                  )}
                </div>
              ) : searchQuery.trim() && !isSearching ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p className="text-sm">No books found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Notifications Button - Hidden on small screens */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-[#e7f1f3] text-[#0e191b] hover:bg-[#d0e3e7] transition-colors flex relative"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* User Profile Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 cursor-pointer group"
              aria-label="User menu"
            >
              <div className="bg-[#2E8B57] text-white flex items-center justify-center rounded-full w-10 h-10 font-bold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden lg:block text-sm font-medium text-[#0e191b]">
                {user.username}
              </span>
              <svg
                className={`hidden lg:block w-4 h-4 text-[#4e8b97] transition-transform ${
                  showUserMenu ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-[#0e191b]">
                      {user.username}
                    </p>
                    <p className="text-xs text-[#4e8b97]">
                      Member since {new Date(user.createdAt).getFullYear()}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[#e7f1f3] text-[#0e191b]"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
