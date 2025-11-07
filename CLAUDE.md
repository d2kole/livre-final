# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Codex Collective** is a social book discovery and tracking web application built with React 18, TypeScript, Vite, Zustand, and Tailwind CSS. The app integrates with Google Books API for book discovery and uses LocalStorage for data persistence.

## Core Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (React-TS template)
- **State Management**: Zustand (lightweight global store)
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router DOM v6
- **Drag & Drop**: @dnd-kit/core
- **Charts**: Recharts
- **Validation**: Zod schemas
- **Testing**: Vitest + React Testing Library

## Project Structure

```
src/
├── components/       # Reusable UI components (BookCard, Navbar, Footer, etc.)
├── pages/           # Route-level page components
├── store/           # Zustand state slices (books, user, feed)
├── hooks/           # Custom React hooks (useLocalStorage, useDebounce)
├── types/           # TypeScript interfaces and type definitions
├── services/        # External API integrations (googleBooks.ts)
└── schemas/         # Zod validation schemas for LocalStorage
```

## Development Commands

**Initial Setup**:
```bash
npm create vite@latest codex-collective --template react-ts
cd codex-collective
npm install
```

**Install Dependencies**:
```bash
npm install react-router-dom zustand tailwindcss @dnd-kit/core recharts zod
npm install -D @vitejs/plugin-react
```

**Development**:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Code Quality**:
```bash
npm run lint         # Run ESLint
npx prettier --write src/  # Format code
```

**Testing**:
```bash
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
```

## Architecture Overview

### State Management (Zustand)

Three separate state slices with LocalStorage middleware:
- **books.ts**: Book collection, search results, reading status management
- **user.ts**: User authentication and profile
- **feed.ts**: Social activity stream, likes, and comments

All state is persisted to LocalStorage with versioned keys (`codex:v1:books`, `codex:v1:user`, `codex:v1:feed`).

### Routing Structure

```
/login              -> LoginPage (public)
/                   -> DashboardPage (protected)
/my-books           -> MyBooksPage (protected)
/browse             -> BrowsePage (protected)
/book/:id           -> BookDetailsPage (protected)
/feed               -> FeedPage (protected)
```

Protected routes redirect to `/login` if user is not authenticated.

### Google Books API Integration

Service layer at `src/services/googleBooks.ts`:
```typescript
// API endpoint pattern
const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

// Map API response to internal Book interface
const books = data.items.map(item => ({
  id: item.id,
  title: item.volumeInfo.title,
  authors: item.volumeInfo.authors || ['Unknown'],
  thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
  description: item.volumeInfo.description || ''
}));
```

**Important**: Search is debounced (300ms) using `useDebounce` hook to prevent excessive API calls.

### Data Persistence

All application data is persisted to LocalStorage:
- User profile stored in `codex:v1:user`
- Book collection in `codex:v1:books`
- Feed activity in `codex:v1:feed`

Zod schemas validate data integrity on load to prevent corrupted state.

### Drag-and-Drop System

Books can be dragged between reading status lists using `@dnd-kit/core`:
- **Want to Read** → **Currently Reading** → **Read**
- Status changes trigger:
  1. Zustand store update
  2. LocalStorage sync
  3. Dashboard progress recalculation
  4. Feed post generation

## Key Type Definitions

**Book Interface**:
```typescript
interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  status: ReadingStatus;
}
```

**Reading Status**:
```typescript
enum ReadingStatus {
  WantToRead = 'want-to-read',
  CurrentlyReading = 'currently-reading',
  Read = 'read'
}
```

## Design System

**Colors**:
- Primary: Teal accent (`#2E8B57`)
- Background: Light pastel (`#f8fbfc`)
- Text: Dark (`#0e191b`)
- Secondary: Light teal (`#e7f1f3`)

**Responsive Breakpoints** (Tailwind):
- Mobile: Default
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

## Development Best Practices

1. **TypeScript Strict Mode**: Always enabled - no implicit any, proper null checks
2. **Accessibility**: Include ARIA labels, keyboard navigation, focus management
3. **Error Handling**: Handle missing data gracefully with defaults
4. **State Updates**: Use optimistic UI for immediate feedback
5. **Component Design**: Keep components small and composable

## Testing Requirements

- **Unit Tests**: Zustand actions, custom hooks, utility functions
- **Integration Tests**: Login flow, search & add, drag-and-drop, feed interactions
- **Lighthouse Targets**: Performance ≥ 90, Accessibility ≥ 90
- **No Console Warnings**: Clean production build required

## Git Workflow

**Branch Naming**:
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

**Commit Format** (Conventional Commits):
```
feat: add Google Books search integration
fix: resolve drag-and-drop state persistence
docs: update README with setup instructions
```

**Pull Request Requirements**:
- All PRs require review before merging to `main`
- `main` branch is protected
- CI/CD auto-deploys on merge

## Deployment

**Target**: GitHub Pages
**Build Command**: `npm run build`
**Deploy Trigger**: Merge to `main` branch via GitHub Actions

**Important**: Configure SPA fallback for client-side routing.

## Common Development Tasks

**Add a New Book to Collection**:
```typescript
const { addBook } = useBookStore();
addBook({ ...bookData, status: ReadingStatus.WantToRead });
```

**Update Book Status**:
```typescript
const { updateBookStatus } = useBookStore();
updateBookStatus(bookId, ReadingStatus.Read);
// Automatically triggers: store update → localStorage sync → dashboard refresh
```

**Search Books**:
```typescript
import { searchBooks } from '@/services/googleBooks';
const results = await searchBooks(query);
```

**Access Current User**:
```typescript
const { user } = useUserStore();
// user contains: { id, username, createdAt }
```

## Known Constraints

- **No Backend**: All data stored in browser LocalStorage (data lost on cache clear)
- **Google Books API**: No API key required, but has rate limits
- **Authentication**: Lightweight username-only system (not production-secure)
- **Cross-Device Sync**: Not supported (LocalStorage is per-browser)

## Definition of Done

A feature is complete when:
- [ ] TypeScript compiles without errors
- [ ] All tests passing
- [ ] No console warnings
- [ ] Accessibility requirements met (ARIA, keyboard nav)
- [ ] LocalStorage persistence working
- [ ] Responsive on mobile/tablet/desktop
- [ ] Code reviewed and merged via PR

## Future Enhancements

- Dark mode toggle
- AI-based recommendations using embeddings
- Backend integration for cross-device sync
- Social features (follow users, share lists)
