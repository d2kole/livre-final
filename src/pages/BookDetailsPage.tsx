import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useBookStore } from '../store/books';
import { useUserStore } from '../store/user';
import { ReadingStatus } from '../types';

/**
 * Review interface for mock review data
 */
interface Review {
  id: string;
  username: string;
  rating: number;
  text: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  avatarUrl: string;
}

/**
 * BookDetailsPage component
 * Displays detailed book information with reviews in Stitch design format
 */
export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, updateBookStatus } = useBookStore();
  const { user } = useUserStore();

  // Find the book by ID
  const book = books.find(b => b.id === id);

  // Mock review data (in a real app, this would come from an API or store)
  const mockReviews: Review[] = [
    {
      id: '1',
      username: 'Sophia Bennett',
      rating: 5,
      text: 'Absolutely captivating! This book kept me on the edge of my seat from beginning to end. The writing is superb, and the plot twists were unexpected and thrilling. Highly recommend!',
      timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 15,
      dislikes: 2,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia'
    },
    {
      id: '2',
      username: 'Ethan Clark',
      rating: 4,
      text: 'A solid mystery with a compelling storyline. The characters were well-developed, and the suspense built up nicely. While I enjoyed it, I felt the ending could have been a bit stronger.',
      timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      dislikes: 3,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan'
    },
    {
      id: '3',
      username: 'Chloe Davis',
      rating: 3,
      text: 'An okay read. The premise was intriguing, but the pacing felt a bit slow at times. The mystery was decent, but I wasn\'t completely satisfied with the resolution.',
      timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 5,
      dislikes: 4,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe'
    }
  ];

  // Calculate average rating
  const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length;
  const totalReviews = 1234; // Mock total review count

  // Rating distribution (mock data)
  const ratingDistribution = {
    5: 40,
    4: 30,
    3: 15,
    2: 10,
    1: 5
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-[#fcf8f9] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-[#1b0d11] mb-4">
            Book Not Found
          </h1>
          <p className="text-[#9a4c5f] mb-4">
            The book you're looking for could not be found in your collection.
          </p>
          <button
            onClick={() => navigate('/my-books')}
            className="px-4 py-2 bg-[#f3e7ea] text-[#1b0d11] rounded-lg hover:bg-[#e7cfd5] transition-colors font-medium"
          >
            Back to My Books
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: ReadingStatus) => {
    updateBookStatus(book.id, newStatus);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${Math.floor(diffDays / 30) || 'Less than a'} month${diffDays >= 60 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? 's' : ''} ago`;
    } else {
      return `${Math.floor(diffDays / 365)} year${diffDays >= 730 ? 's' : ''} ago`;
    }
  };

  // Star rendering component
  const StarRating = ({ rating, size = 18 }: { rating: number; size?: number }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <div key={i} className={i <= rating ? "text-[#f0426d]" : "text-[#d7adb7]"} data-icon="Star" data-size={`${size}px`} data-weight={i <= rating ? "fill" : "regular"}>
          <svg xmlns="http://www.w3.org/2000/svg" width={`${size}px`} height={`${size}px`} fill="currentColor" viewBox="0 0 256 256">
            {i <= rating ? (
              <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z" />
            ) : (
              <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z" />
            )}
          </svg>
        </div>
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-[#fcf8f9]">
      <div className="px-10 lg:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1">
          {/* Breadcrumb */}
          <div className="flex flex-wrap gap-2 p-4">
            <Link to="/my-books" className="text-[#9a4c5f] text-base font-medium leading-normal hover:underline">
              Books
            </Link>
            <span className="text-[#9a4c5f] text-base font-medium leading-normal">/</span>
            <span className="text-[#1b0d11] text-base font-medium leading-normal">{book.title}</span>
          </div>

          {/* Title Section */}
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#1b0d11] tracking-light text-[32px] font-bold leading-tight">{book.title}</p>
              <p className="text-[#9a4c5f] text-sm font-normal leading-normal">by {book.authors.join(', ')}</p>
            </div>
          </div>

          {/* Book Info with Image */}
          <div className="p-4">
            <div className="flex items-stretch justify-between gap-4 rounded-lg">
              <div className="flex flex-[2_2_0px] flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[#9a4c5f] text-sm font-normal leading-normal">{averageRating.toFixed(1)} stars</p>
                  <p className="text-[#1b0d11] text-base font-bold leading-tight">{book.title}</p>
                  <p className="text-[#9a4c5f] text-sm font-normal leading-normal">{book.authors.join(', ')}</p>
                </div>
                <button
                  onClick={() => handleStatusChange(
                    book.status === ReadingStatus.WantToRead ? ReadingStatus.CurrentlyReading :
                    book.status === ReadingStatus.CurrentlyReading ? ReadingStatus.Read :
                    ReadingStatus.WantToRead
                  )}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f3e7ea] text-[#1b0d11] text-sm font-medium leading-normal w-fit hover:bg-[#e7cfd5] transition-colors"
                >
                  <span className="truncate">
                    {book.status === ReadingStatus.WantToRead ? 'Start Reading' :
                     book.status === ReadingStatus.CurrentlyReading ? 'Mark as Read' :
                     'Read Again'}
                  </span>
                </button>
              </div>
              <div
                className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg flex-1"
                style={{ backgroundImage: `url("${book.thumbnail || 'https://via.placeholder.com/300x400?text=No+Cover'}")` }}
              />
            </div>
          </div>

          {/* About the Book */}
          <h2 className="text-[#1b0d11] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            About the book
          </h2>
          <p className="text-[#1b0d11] text-base font-normal leading-normal pb-3 pt-1 px-4">
            {book.description || 'No description available for this book.'}
          </p>

          {/* Reviews Section */}
          <h2 className="text-[#1b0d11] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Reviews
          </h2>

          {/* Rating Summary */}
          <div className="flex flex-wrap gap-x-8 gap-y-6 p-4">
            <div className="flex flex-col gap-2">
              <p className="text-[#1b0d11] text-4xl font-black leading-tight tracking-[-0.033em]">
                {averageRating.toFixed(1)}
              </p>
              <StarRating rating={Math.round(averageRating)} size={18} />
              <p className="text-[#1b0d11] text-base font-normal leading-normal">
                {totalReviews.toLocaleString()} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <>
                  <p key={`label-${rating}`} className="text-[#1b0d11] text-sm font-normal leading-normal">{rating}</p>
                  <div key={`bar-${rating}`} className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#e7cfd5]">
                    <div className="rounded-full bg-[#f0426d]" style={{ width: `${ratingDistribution[rating as keyof typeof ratingDistribution]}%` }} />
                  </div>
                  <p key={`pct-${rating}`} className="text-[#9a4c5f] text-sm font-normal leading-normal text-right">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}%
                  </p>
                </>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="flex flex-col gap-8 overflow-x-hidden bg-[#fcf8f9] p-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="flex flex-col gap-3 bg-[#fcf8f9]">
                <div className="flex items-center gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{ backgroundImage: `url("${review.avatarUrl}")` }}
                  />
                  <div className="flex-1">
                    <p className="text-[#1b0d11] text-base font-medium leading-normal">{review.username}</p>
                    <p className="text-[#9a4c5f] text-sm font-normal leading-normal">{formatDate(review.timestamp)}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={20} />
                <p className="text-[#1b0d11] text-base font-normal leading-normal">{review.text}</p>
                <div className="flex gap-9 text-[#9a4c5f]">
                  <button className="flex items-center gap-2 hover:text-[#f0426d] transition-colors">
                    <div className="text-inherit" data-icon="ThumbsUp" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z" />
                      </svg>
                    </div>
                    <p className="text-inherit">{review.likes}</p>
                  </button>
                  <button className="flex items-center gap-2 hover:text-[#f0426d] transition-colors">
                    <div className="text-inherit" data-icon="ThumbsDown" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z" />
                      </svg>
                    </div>
                    <p className="text-inherit">{review.dislikes}</p>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
