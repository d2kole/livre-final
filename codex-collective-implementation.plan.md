# Codex Collective - Implementation Plan

## Project Overview

**Product**: Social Book Discovery and Tracking Web Application  
**Tech Stack**: React 18, TypeScript, Vite, React Router DOM, Zustand, Tailwind CSS, Google Books API  
**Deployment**: GitHub Pages  
**Goal**: Build a modern, interactive platform for users to search, track, and share books

---

## Task 1: Project Initialization & Development Environment

### Objective
Set up the foundational development environment with all necessary tooling and configuration.

### Subtasks
- [ ] Initialize Vite project with React-TypeScript template (`npm create vite@latest codex-collective --template react-ts`)
- [ ] Install core dependencies:
  - `react-router-dom` (v6)
  - `zustand` (state management)
  - `tailwindcss` (styling)
  - `@dnd-kit/core` (drag-and-drop)
  - `recharts` (charts)
  - `zod` (validation)
- [ ] Configure Tailwind CSS with custom theme
  - Pastel background colors
  - Teal accent color (#2E8B57)
  - Responsive breakpoints
- [ ] Set up project folder structure:
  ```
  src/
  ├── components/
  ├── pages/
  ├── store/
  ├── hooks/
  ├── types/
  ├── services/
  └── App.tsx
  ```
- [ ] Configure ESLint and Prettier for code quality
- [ ] Set TypeScript to strict mode in `tsconfig.json`
- [ ] Initialize Git repository with proper `.gitignore`

### Acceptance Criteria
- ✅ App runs locally with `npm run dev`
- ✅ Tailwind compiles without errors
- ✅ TypeScript strict mode enabled
- ✅ No console warnings on fresh install

---

## Task 2: TypeScript Interfaces & Type System

### Objective
Define all TypeScript interfaces and type definitions for type safety across the application.

### Subtasks
- [ ] Create `src/types/book.ts` with Book interface:
  ```ts
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
- [ ] Define ReadingStatus enum:
  ```ts
  enum ReadingStatus {
    WantToRead = 'want-to-read',
    CurrentlyReading = 'currently-reading',
    Read = 'read'
  }
  ```
- [ ] Create User interface in `src/types/user.ts`
- [ ] Create FeedPost interface in `src/types/feed.ts`
- [ ] Define BookCollectionState interface
- [ ] Create Zod schemas for LocalStorage validation in `src/schemas/`
- [ ] Export all types from `src/types/index.ts`

### Acceptance Criteria
- ✅ All interfaces compile without errors
- ✅ Zod schemas validate test data correctly
- ✅ Types are properly exported and importable

---

## Task 3: Zustand State Management & LocalStorage Persistence

### Objective
Implement global state management with automatic LocalStorage synchronization.

### Subtasks
- [ ] Create `src/store/books.ts` Zustand slice:
  - `books` array state
  - `addBook()` action
  - `removeBook()` action
  - `updateBookStatus()` action
  - `searchResults` state
- [ ] Create `src/store/user.ts` Zustand slice:
  - `user` object state
  - `login()` action
  - `logout()` action
- [ ] Create `src/store/feed.ts` Zustand slice:
  - `posts` array state
  - `addPost()` action
  - `likePost()` action
  - `addComment()` action
- [ ] Implement `src/hooks/useLocalStorage.ts` hook
- [ ] Add LocalStorage middleware to sync Zustand stores
- [ ] Use versioned keys: `codex:v1:books`, `codex:v1:user`, `codex:v1:feed`
- [ ] Implement state hydration on app initialization

### Acceptance Criteria
- ✅ State persists after page refresh
- ✅ All CRUD operations work correctly
- ✅ No console errors with LocalStorage operations
- ✅ Zod validation prevents corrupted data

---

## Task 4: Routing & Layout Components

### Objective
Set up React Router and create the global layout structure.

### Subtasks
- [ ] Configure React Router DOM v6 in `App.tsx` with routes:
  - `/login` - LoginPage
  - `/` - DashboardPage (protected)
  - `/my-books` - MyBooksPage (protected)
  - `/book/:id` - BookDetailsPage (protected)
  - `/feed` - FeedPage (protected)
  - `/browse` - BrowsePage (protected)
- [ ] Create `src/components/Layout.tsx` wrapper component
- [ ] Build `src/components/Navbar.tsx`:
  - Logo and app name
  - Navigation links (Home, My Books, Browse, Community)
  - Search bar
  - User profile display
  - Mobile hamburger menu
- [ ] Create `src/components/Footer.tsx` with credits
- [ ] Implement protected route wrapper for authentication
- [ ] Add active link highlighting
- [ ] Ensure keyboard navigation (Tab, Enter, Escape)
- [ ] Add ARIA labels for accessibility

### Acceptance Criteria
- ✅ All routes navigate correctly
- ✅ Navbar collapses below `md` breakpoint
- ✅ Hamburger menu toggles with keyboard
- ✅ Protected routes redirect to `/login`
- ✅ Active route highlighted in navbar

---

## Task 5: Authentication & Login System

### Objective
Implement lightweight local authentication with username storage.

### Subtasks
- [ ] Create `src/pages/LoginPage.tsx`
- [ ] Build login form with username input field
- [ ] Add form validation (required field, min 3 characters)
- [ ] Implement inline error messages
- [ ] Create authentication logic:
  - Save `{ id, username, createdAt }` to LocalStorage
  - Update Zustand user store
- [ ] Add redirect logic:
  - After login → redirect to `/`
  - Unauthenticated users → redirect to `/login`
- [ ] Display username in Navbar header
- [ ] Implement logout functionality with state clearing

### Acceptance Criteria
- ✅ Empty input shows error message
- ✅ LocalStorage key `codex:v1:user` created on login
- ✅ User redirected to Dashboard after successful login
- ✅ Unauthenticated users cannot access protected routes
- ✅ Logout clears user data and redirects to login

---

## Task 6: Google Books API Integration & Search

### Objective
Integrate Google Books API for real-time book search and discovery.

### Subtasks
- [ ] Create `src/services/googleBooks.ts` API service layer
- [ ] Implement `searchBooks(query: string)` function:
  ```ts
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
  ```
- [ ] Map API response to Book interface
- [ ] Handle API errors and rate limiting
- [ ] Create `src/pages/BrowsePage.tsx`
- [ ] Build search input with debouncing (300ms) using `useDebounce` hook
- [ ] Create `src/components/BookCard.tsx` for displaying results
- [ ] Add "Add to Collection" button with status dropdown
- [ ] Implement loading spinner component
- [ ] Create empty state component ("No results found")
- [ ] Add error boundary for API failures

### Acceptance Criteria
- ✅ Search returns results within 3 seconds
- ✅ Debouncing prevents excessive API calls
- ✅ Results map correctly to Book interface
- ✅ "Add to Collection" persists book to Zustand + LocalStorage
- ✅ Loading and empty states display properly
- ✅ API errors handled gracefully with user feedback

---

## Task 7: Dashboard & Reading Challenge

### Objective
Build the main dashboard with reading progress, recent books, and recommendations.

### Subtasks
- [ ] Create `src/pages/DashboardPage.tsx`
- [ ] Build Reading Challenge section:
  - Progress bar component using Recharts
  - Calculate completion based on "Read" books count
  - Display goal (e.g., "25 books this year")
  - Show current count and percentage
- [ ] Create Recent Books carousel:
  - Horizontal scrollable container
  - Display last 5 added books
  - Click to navigate to Book Details
- [ ] Build Recommendations section:
  - Fetch Google Books API based on user's genres
  - Display 3-5 suggested books
  - "Add to Collection" quick action
- [ ] Ensure responsive grid layout:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- [ ] Add dynamic data updates when book status changes

### Acceptance Criteria
- ✅ Progress bar updates when books marked as "Read"
- ✅ Carousel scrollable on all devices
- ✅ Recommendations clickable → navigate to Book Details
- ✅ Dashboard recalculates on every status change
- ✅ Responsive layout adapts to all breakpoints

---

## Task 8: My Books Page with Drag-and-Drop

### Objective
Create an interactive bookshelf with drag-and-drop functionality to organize books by reading status.

### Subtasks
- [ ] Create `src/pages/MyBooksPage.tsx`
- [ ] Build tab navigation component:
  - "Want to Read" tab
  - "Currently Reading" tab
  - "Read" tab
- [ ] Create `src/components/BookshelfGrid.tsx` using `@dnd-kit/core`
- [ ] Implement drag-and-drop functionality:
  - Draggable book cards
  - Droppable zones for each status
  - Visual feedback during drag
- [ ] Add keyboard DnD support:
  - Space to pick up/drop
  - Arrow keys to move
- [ ] Implement ARIA announcements for accessibility
- [ ] Update book status in Zustand store on drop
- [ ] Sync changes to LocalStorage
- [ ] Trigger Dashboard progress recalculation
- [ ] Add confirmation modal for status changes (optional)

### Acceptance Criteria
- ✅ Books draggable between status lists
- ✅ Status persists after page refresh
- ✅ Dashboard reading challenge updates automatically
- ✅ Keyboard DnD works (Space + Arrow keys)
- ✅ ARIA announcements for screen readers
- ✅ Visual feedback during drag operations

---

## Task 9: Book Details & Community Feed

### Objective
Build individual book pages and implement social feed with likes and comments.

### Subtasks

#### Book Details Page
- [ ] Create `src/pages/BookDetailsPage.tsx`
- [ ] Use `useParams()` to get book ID from route
- [ ] Create `src/components/BookDetails.tsx` component
- [ ] Display book metadata:
  - Cover image
  - Title and authors
  - Description
  - Published date, page count
  - Categories/genres
- [ ] Add action buttons:
  - "Want to Read"
  - "Currently Reading"
  - "Mark as Read"
- [ ] Create ratings chart using Recharts (if data available)
- [ ] Add "Back" button navigation
- [ ] Handle missing data gracefully ("Unknown Author")

#### Community Feed
- [ ] Create `src/pages/FeedPage.tsx`
- [ ] Create `src/components/FeedCard.tsx` component
- [ ] Display activity stream:
  - "User finished reading Book Title"
  - "User started reading Book Title"
- [ ] Add like button with counter
- [ ] Implement comment functionality:
  - Input field for new comments
  - Display existing comments
  - Comment timestamp
- [ ] Auto-generate feed posts when book status changes
- [ ] Implement optimistic UI updates
- [ ] Link book titles to Book Details page

### Acceptance Criteria
- ✅ Dynamic route `/book/:id` works for all books
- ✅ Back button navigates to previous page
- ✅ Missing data displays defaults gracefully
- ✅ Feed persists in LocalStorage
- ✅ Likes increment instantly (optimistic UI)
- ✅ Comments appear without page refresh
- ✅ Status changes auto-generate feed posts

---

## Task 10: Testing, Polish & Deployment

### Objective
Ensure code quality, performance, accessibility, and deploy to production.

### Subtasks
- [ ] Write unit tests using Vitest:
  - Zustand store actions
  - Custom hooks (useLocalStorage, useDebounce)
  - Utility functions
- [ ] Write integration tests using React Testing Library:
  - Login flow
  - Book search and add to collection
  - Drag-and-drop status change
  - Feed like/comment interactions
- [ ] Run Lighthouse audit:
  - Target: Performance ≥ 90
  - Target: Accessibility ≥ 90
  - Target: Best Practices ≥ 90
- [ ] Fix all console warnings and errors
- [ ] Fix all ESLint errors
- [ ] Configure GitHub Actions CI/CD:
  - Create `.github/workflows/deploy.yml`
  - Build on push to main
  - Deploy to GitHub Pages
- [ ] Build production bundle (`npm run build`)
- [ ] Test production build locally
- [ ] Deploy to GitHub Pages
- [ ] Create comprehensive `README.md`:
  - Setup instructions
  - Tech stack overview
  - Features list
  - Screenshots
- [ ] Verify mobile responsiveness on real devices
- [ ] Test cross-browser compatibility (Chrome, Firefox, Safari)

### Acceptance Criteria
- ✅ All tests passing
- ✅ Lighthouse scores ≥ 90 for Performance and Accessibility
- ✅ No console warnings in production build
- ✅ CI/CD pipeline successfully deploys
- ✅ Application accessible via GitHub Pages URL
- ✅ Responsive design verified on mobile/tablet/desktop
- ✅ README includes setup and feature documentation

---

## Key Dependencies & Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.x |
| TypeScript | Type Safety | 5.x |
| Vite | Build Tool | 5.x |
| React Router DOM | Routing | 6.x |
| Zustand | State Management | 4.x |
| Tailwind CSS | Styling | 3.x |
| @dnd-kit/core | Drag & Drop | Latest |
| Recharts | Charts | Latest |
| Zod | Validation | Latest |
| Vitest | Testing | Latest |
| React Testing Library | Component Testing | Latest |

---

## File Structure

```
codex-collective/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
├── src/
│   ├── components/
│   │   ├── BookCard.tsx
│   │   ├── BookDetails.tsx
│   │   ├── BookshelfGrid.tsx
│   │   ├── FeedCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── Navbar.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── pages/
│   │   ├── BrowsePage.tsx
│   │   ├── BookDetailsPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── FeedPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── MyBooksPage.tsx
│   ├── schemas/
│   │   └── storage.ts
│   ├── services/
│   │   └── googleBooks.ts
│   ├── store/
│   │   ├── books.ts
│   │   ├── feed.ts
│   │   └── user.ts
│   ├── types/
│   │   ├── book.ts
│   │   ├── feed.ts
│   │   ├── index.ts
│   │   └── user.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Success Criteria

### Functional Requirements
- ✅ User can log in with username
- ✅ User can search books via Google Books API
- ✅ User can add books to collection with status
- ✅ User can drag-and-drop books between status categories
- ✅ User can view individual book details
- ✅ User can see reading challenge progress
- ✅ User can view and interact with community feed
- ✅ All data persists across sessions

### Non-Functional Requirements
- ✅ Lighthouse Performance score ≥ 90
- ✅ Lighthouse Accessibility score ≥ 90
- ✅ Mobile-responsive on all devices
- ✅ Keyboard navigation fully functional
- ✅ No console errors or warnings
- ✅ Fast load times (< 3 seconds)

### Deployment
- ✅ Deployed to GitHub Pages
- ✅ CI/CD pipeline functional
- ✅ Public URL accessible
- ✅ README documentation complete

---

## Estimated Timeline

| Task | Estimated Time | Priority |
|------|---------------|----------|
| Task 1: Project Setup | 2 hours | Critical |
| Task 2: TypeScript Interfaces | 1 hour | Critical |
| Task 3: State Management | 3 hours | Critical |
| Task 4: Routing & Layout | 3 hours | Critical |
| Task 5: Authentication | 2 hours | High |
| Task 6: Google Books API | 4 hours | High |
| Task 7: Dashboard | 4 hours | High |
| Task 8: Drag-and-Drop | 5 hours | High |
| Task 9: Details & Feed | 6 hours | Medium |
| Task 10: Testing & Deploy | 4 hours | Critical |

**Total Estimated Time**: 34 hours (~1 week at 6-7 hours/day)

---

## Definition of Done

A task is considered **Done** when:
- [ ] All subtasks completed
- [ ] Code reviewed (if team project)
- [ ] Tests written and passing
- [ ] No console warnings
- [ ] TypeScript compiles without errors
- [ ] Accessibility requirements met
- [ ] Documentation updated

---

## Notes

- This plan follows the PRD specifications exactly
- Focus on mobile-first responsive design
- Prioritize accessibility throughout development
- Use conventional commit messages (`feat:`, `fix:`, `docs:`)
- Create feature branches for each major task
- Open PRs for code review before merging to main

---

**End of Implementation Plan**  
*Version 1.0 - Codex Collective*

