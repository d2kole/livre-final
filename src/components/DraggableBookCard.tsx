import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Book } from '../types';

interface DraggableBookCardProps {
  book: Book;
  onClick: () => void;
  isDragging?: boolean;
}

/**
 * DraggableBookCard component
 * Book card with drag-and-drop functionality
 */
export default function DraggableBookCard({
  book,
  onClick,
  isDragging = false,
}: DraggableBookCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: book.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : 'hover:shadow-lg'
      }`}
    >
      {/* Book thumbnail */}
      <div
        className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        aria-label={`View details for ${book.title} by ${book.authors.join(', ')}`}
      >
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        ) : (
          <div className="text-gray-400 text-center p-4 pointer-events-none">
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
            <span className="text-sm">No cover</span>
          </div>
        )}
      </div>

      {/* Book details */}
      <div className="p-4 pointer-events-none">
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {book.authors.join(', ')}
        </p>

        {book.pageCount && (
          <p className="text-xs text-gray-500 mt-2">{book.pageCount} pages</p>
        )}
      </div>

      {/* Drag indicator */}
      <div className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1.5 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>
    </div>
  );
}
