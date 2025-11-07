import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useBookStore } from '../store/books';
import { Book, ReadingStatus } from '../types';
import DraggableBookCard from '../components/DraggableBookCard';
import DroppableSection from '../components/DroppableSection';
import { useNavigate } from 'react-router-dom';

/**
 * MyBooksPage component
 * Interactive bookshelf with drag-and-drop functionality for organizing books by status
 */
export default function MyBooksPage() {
  const { books, updateBookStatus } = useBookStore();
  const navigate = useNavigate();
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  // Configure pointer sensor for drag interactions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  // Group books by reading status
  const booksByStatus = {
    [ReadingStatus.WantToRead]: books.filter(
      (book) => book.status === ReadingStatus.WantToRead
    ),
    [ReadingStatus.CurrentlyReading]: books.filter(
      (book) => book.status === ReadingStatus.CurrentlyReading
    ),
    [ReadingStatus.Read]: books.filter(
      (book) => book.status === ReadingStatus.Read
    ),
  };

  // Handle drag start - store the book being dragged
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const book = books.find((b) => b.id === active.id);
    setActiveBook(book || null);
  };

  // Handle drag end - update book status if dropped on different section
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const newStatus = over.id as ReadingStatus;
      updateBookStatus(active.id as string, newStatus);
    }

    setActiveBook(null);
  };

  // Handle book card click - navigate to book details
  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  const statusConfig = [
    {
      status: ReadingStatus.WantToRead,
      title: 'Want to Read',
      color: 'border-blue-300',
      emptyMessage: 'No books in your wishlist yet',
    },
    {
      status: ReadingStatus.CurrentlyReading,
      title: 'Currently Reading',
      color: 'border-yellow-300',
      emptyMessage: 'Start reading a book!',
    },
    {
      status: ReadingStatus.Read,
      title: 'Read',
      color: 'border-teal-300',
      emptyMessage: 'No completed books yet',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Books</h1>
          <p className="text-gray-600">
            Organize your collection by dragging books between sections
          </p>
        </div>

        {/* Empty state */}
        {books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto mb-4 text-gray-300"
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
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Your bookshelf is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Start building your collection by browsing and adding books
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
            >
              Browse Books
            </button>
          </div>
        ) : (
          /* Drag and drop context */
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {statusConfig.map((config) => (
                <DroppableSection
                  key={config.status}
                  id={config.status}
                  title={config.title}
                  color={config.color}
                  books={booksByStatus[config.status]}
                  emptyMessage={config.emptyMessage}
                  onBookClick={handleBookClick}
                />
              ))}
            </div>

            {/* Drag overlay - shows dragged book while dragging */}
            <DragOverlay>
              {activeBook ? (
                <div className="opacity-80 transform rotate-3 scale-105">
                  <DraggableBookCard
                    book={activeBook}
                    onClick={() => {}}
                    isDragging
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}
