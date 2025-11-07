# Services

This directory contains external API integration services.

## Google Books API Service

Located at `googleBooks.ts`, this service provides functions to interact with the Google Books API.

### Environment Variables

Required environment variables in `.env`:

```env
VITE_GOOGLE_BOOKS_API_KEY="your-api-key-here"
VITE_GOOGLE_BOOKS_BASE_URL=https://www.googleapis.com/books/v1
```

### Functions

#### `searchBooks(query: string, maxResults?: number): Promise<Book[]>`

Search for books using the Google Books API.

**Parameters:**
- `query` - Search query string (e.g., "Harry Potter", "science fiction")
- `maxResults` - Maximum number of results to return (default: 20)

**Returns:** Promise resolving to array of `Book` objects

**Example:**
```typescript
import { searchBooks } from '@/services/googleBooks';

const results = await searchBooks('React programming', 10);
```

**Error Handling:**
- Returns empty array for empty queries
- Throws error for rate limiting (status 429)
- Throws error for other HTTP errors
- All errors are user-friendly with descriptive messages

---

#### `getBookById(bookId: string): Promise<Book>`

Get detailed information about a specific book by its Google Books volume ID.

**Parameters:**
- `bookId` - Google Books volume ID (e.g., "zyTCAlFPjgYC")

**Returns:** Promise resolving to a `Book` object

**Example:**
```typescript
import { getBookById } from '@/services/googleBooks';

const book = await getBookById('zyTCAlFPjgYC');
```

**Error Handling:**
- Throws error if bookId is empty
- Throws error for HTTP errors
- Provides user-friendly error messages

---

#### `getRecommendations(query: string, maxResults?: number): Promise<Book[]>`

Get book recommendations based on a subject/genre query.

**Parameters:**
- `query` - Subject or genre (e.g., "fiction", "science", "history")
- `maxResults` - Maximum number of results to return (default: 8)

**Returns:** Promise resolving to array of `Book` objects

**Example:**
```typescript
import { getRecommendations } from '@/services/googleBooks';

const recommendations = await getRecommendations('science fiction', 6);
```

### Data Mapping

The service automatically maps Google Books API response to the internal `Book` interface:

| Google Books API | Book Interface | Default Value |
|------------------|----------------|---------------|
| `id` | `id` | - |
| `volumeInfo.title` | `title` | "Unknown Title" |
| `volumeInfo.authors` | `authors` | ["Unknown Author"] |
| `volumeInfo.description` | `description` | "No description available." |
| `volumeInfo.imageLinks.thumbnail` | `thumbnail` | "/placeholder-book.png" |
| `volumeInfo.publishedDate` | `publishedDate` | undefined |
| `volumeInfo.pageCount` | `pageCount` | undefined |
| `volumeInfo.categories` | `categories` | undefined |
| - | `status` | `ReadingStatus.WantToRead` |

### Rate Limiting

The Google Books API has rate limits. The service handles:
- Status 429 (Rate Limit Exceeded) with user-friendly error message
- Automatic error logging for debugging
- Graceful degradation with empty results

### Best Practices

1. **Debounce search input** - Use `useDebounce` hook (300ms) to prevent excessive API calls
2. **Handle loading states** - Show loading spinner during API requests
3. **Display errors gracefully** - Show user-friendly error messages
4. **Validate input** - Check for empty queries before calling API
5. **Add error boundaries** - Wrap components using this service with error boundaries

### TypeScript Support

Environment variables are typed in `src/vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_GOOGLE_BOOKS_API_KEY: string;
  readonly VITE_GOOGLE_BOOKS_BASE_URL: string;
}
```

### Testing

Example test cases to implement:

```typescript
describe('googleBooks service', () => {
  it('should return empty array for empty query', async () => {
    const results = await searchBooks('');
    expect(results).toEqual([]);
  });

  it('should map API response to Book interface', async () => {
    const results = await searchBooks('React');
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('authors');
    expect(results[0].status).toBe(ReadingStatus.WantToRead);
  });

  it('should handle API errors gracefully', async () => {
    await expect(getBookById('')).rejects.toThrow('Book ID is required');
  });
});
```
