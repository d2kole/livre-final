import { useDroppable } from '@dnd-kit/core';
import { Book, ReadingStatus } from '../types';
import DraggableBookCard from './DraggableBookCard';

interface DroppableSectionProps {
  id: ReadingStatus;
  title: string;
  color: string;
  books: Book[];
  emptyMessage: string;
  onBookClick: (bookId: string) => void;
}

/**
 * DroppableSection component
 * Droppable container for books organized by reading status
 */
export default function DroppableSection({
  id,
  title,
  color,
  books,
  emptyMessage,
  onBookClick,
}: DroppableSectionProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-lg shadow-md p-6 border-t-4 transition-all duration-200 ${color} ${
        isOver ? 'ring-4 ring-teal-300 ring-opacity-50 scale-[1.02]' : ''
      }`}
    >
      {/* Section header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className="bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
            {books.length}
          </span>
        </div>
        <div className="h-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full w-12"></div>
      </div>

      {/* Books grid or empty state */}
      {books.length === 0 ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isOver
              ? 'border-teal-400 bg-teal-50'
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          <svg
            className={`w-16 h-16 mx-auto mb-3 transition-colors duration-200 ${
              isOver ? 'text-teal-400' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <p
            className={`text-sm font-medium transition-colors duration-200 ${
              isOver ? 'text-teal-600' : 'text-gray-500'
            }`}
          >
            {isOver ? 'Drop book here' : emptyMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-4 min-h-[200px]">
          {books.map((book) => (
            <DraggableBookCard
              key={book.id}
              book={book}
              onClick={() => onBookClick(book.id)}
            />
          ))}
          {isOver && (
            <div className="border-2 border-dashed border-teal-400 bg-teal-50 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-teal-600">
                Drop book here
              </p>
            </div>
          )}
        </div>
      )}

      {/* Drop zone indicator when dragging over */}
      {isOver && books.length > 0 && (
        <div className="mt-4 p-3 bg-teal-50 border-2 border-dashed border-teal-400 rounded-lg text-center">
          <p className="text-sm font-medium text-teal-600">
            Add to {title}
          </p>
        </div>
      )}
    </div>
  );
}
