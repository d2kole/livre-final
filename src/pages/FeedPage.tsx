import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeedStore } from '../store/feed';
import { useUserStore } from '../store/user';

/**
 * FeedPage component
 * Displays global community activity feed with social interactions
 */
export default function FeedPage() {
  const navigate = useNavigate();
  const { posts, likePost, unlikePost, addComment } = useFeedStore();
  const { user } = useUserStore();

  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const handleLike = (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (post?.likes.includes(user.id)) {
      unlikePost(postId, user.id);
    } else {
      likePost(postId, user.id);
    }
  };

  const handleAddComment = (postId: string) => {
    if (!user || !commentText[postId]?.trim()) return;

    addComment(postId, {
      userId: user.id,
      username: user.username,
      text: commentText[postId].trim(),
    });

    setCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fbfc] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0e191b] mb-8">
          Community Feed
        </h1>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Activity Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start adding books to your collection and track your reading progress to see activity here!
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="px-6 py-3 bg-[#2E8B57] text-white rounded-lg hover:bg-[#267347] transition-colors"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const isLiked = user && post.likes.includes(user.id);

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Post Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Book Thumbnail */}
                    <img
                      src={post.book.thumbnail || 'https://via.placeholder.com/80x120?text=No+Cover'}
                      alt={`${post.book.title} cover`}
                      className="w-20 h-30 object-cover rounded shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/book/${post.book.id}`)}
                    />

                    {/* Post Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-[#0e191b]">
                            {post.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(post.timestamp)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.activityType === 'started-reading'
                            ? 'bg-yellow-100 text-yellow-800'
                            : post.activityType === 'finished-reading'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {post.activityType === 'started-reading'
                            ? 'Started Reading'
                            : post.activityType === 'finished-reading'
                            ? 'Finished Reading'
                            : 'Added to Collection'}
                        </span>
                      </div>

                      {/* Book Title */}
                      <h3
                        className="text-lg font-bold text-[#0e191b] cursor-pointer hover:text-[#2E8B57] transition-colors"
                        onClick={() => navigate(`/book/${post.book.id}`)}
                      >
                        {post.book.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {post.book.authors.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Like and Comment Counts */}
                  <div className="flex items-center gap-4 mb-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 ${
                        isLiked
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500'
                      } transition-colors`}
                      aria-label={isLiked ? 'Unlike post' : 'Like post'}
                    >
                      <svg
                        className="w-5 h-5"
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="font-medium">{post.likes.length}</span>
                    </button>

                    <div className="flex items-center gap-2 text-gray-500">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="font-medium">{post.comments.length}</span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {post.comments.length > 0 && (
                    <div className="space-y-3 mb-4 pl-4 border-l-2 border-gray-200">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="text-sm">
                          <p className="font-semibold text-[#0e191b]">
                            {comment.username}
                            <span className="font-normal text-gray-500 ml-2">
                              {formatDate(comment.timestamp)}
                            </span>
                          </p>
                          <p className="text-gray-700 mt-1">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText[post.id] || ''}
                      onChange={(e) =>
                        setCommentText(prev => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id);
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                      aria-label="Comment text"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentText[post.id]?.trim()}
                      className="px-4 py-2 bg-[#2E8B57] text-white rounded-lg hover:bg-[#267347] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Post comment"
                    >
                      Post
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
