Task Distribution Between Collaborators

#SHARED TASKS (Both Collaborators - Do Together First)

##Task 1: Project Initialization (CRITICAL - Must be done first by ONE person, then shared)

Initialize Vite project
Install all dependencies: 
Configure Tailwind CSS:                          
Set up folder structure: 
Configure ESLint/Prettier : 
Initialize Git repository

##Task 2: TypeScript Interfaces (SHARED - Both need these)
All type definitions must be created together since both will use them
Book, User, FeedPost interfaces
ReadingStatus enum
Zod schemas

##Task 3: Zustand State Management (SHARED - Split by domain)
Collab #1: src/store/user.ts (for login), src/store/feed.ts (for feed)
Collab #2: src/store/books.ts (for dashboard/my-books)
Both: src/hooks/useLocalStorage.ts (shared utility)

##Task 4: Routing & Layout (SHARED - Both work together)
Both: Layout.tsx, Navbar.tsx, Footer.tsx
Both: Protected route wrapper
Collab #1: Set up routes for /login, /browse, /feed
Collab #2: Set up routes for /, /my-books, /book/:id


#COLLABORATOR #1 TASKS
Responsible for: /login, /browse, /feed

##Task 5: Authentication & Login System
Create LoginPage.tsx
Build login form with validation
Implement authentication logic
Add redirect logic
Display username in Navbar (coordinate with Collab #2 on Navbar)
Logout functionality

##Task 6: Google Books API Integration & Search (Part of /browse)
Create src/services/googleBooks.ts
Implement searchBooks() function
Map API response to Book interface
Create src/hooks/useDebounce.ts
Handle API errors
Task 6 (continued): Browse Page
Create BrowsePage.tsx
Build search input with debouncing
Create BookCard.tsx component (SHARED with Collab #2)
Add "Add to Collection" functionality
Implement loading/empty states

##Task 9A: Community Feed
Create FeedPage.tsx
Create FeedCard.tsx component
Display activity stream
Like/comment functionality
Auto-generate feed posts on status changes
Optimistic UI updates


#COLLABORATOR #2 TASKS
Responsible for: /, /my-books, /book/:id (dashboard, my books, book details)

##Task 7: Dashboard & Reading Challenge
Create DashboardPage.tsx
Build Reading Challenge with Recharts progress bar
Create Recent Books carousel
Build Recommendations section using Google Books API
Responsive grid layout
Dynamic updates on book status changes

##Task 8: My Books Page with Drag-and-Drop
Create MyBooksPage.tsx
Build tab navigation (Want to Read, Currently Reading, Read)
Create BookshelfGrid.tsx with @dnd-kit/core
Implement drag-and-drop between status lists
Keyboard DnD support
ARIA announcements
Sync to Zustand store and LocalStorage

##Task 9B: Book Details Page
Create BookDetailsPage.tsx
Use useParams() for book ID
Create BookDetails.tsx component
Display full book metadata
Add action buttons (Want to Read, Currently Reading, Mark as Read)
Ratings chart with Recharts
Back button navigation
Handle missing data gracefully


#SHARED FINAL TASK (Both Collaborators)

##Task 10: Testing, Polish & Deployment
Collab #1: Tests for login, browse, feed functionality
Collab #2: Tests for dashboard, my-books, book details
Both: Run Lighthouse audits
Both: Fix console warnings/errors
One person: Configure GitHub Actions CI/CD
Both: Verify mobile responsiveness
One person: Deploy to GitHub Pages
Both: Create comprehensive README


#Dependency Chain & Coordination Points

##Critical Path (Must be done in order):
Day 1 (Both): Task 1 - Project Setup
Day 1 (Both): Task 2 - TypeScript Interfaces
Day 2 (Both): Task 3 - Zustand Stores (split by domain)
Day 2 (Both): Task 4 - Layout & Routing

##Parallel Work (After Day 2):

Collab #1 can work independently:
Task 5: Login (needs: user store, layout)
Task 6: Browse/API (needs: books store, types)
Task 9A: Feed (needs: feed store, types)

Collab #2 can work independently:
Task 7: Dashboard (needs: books store, layout, API service from Collab #1)
Task 8: My Books (needs: books store, types)
Task 9B: Book Details (needs: books store, types)


#Coordination Points:

##BookCard.tsx - Shared component used in both Browse and Dashboard
Solution: Collab #1 creates it, Collab #2 reviews and uses it

##Google Books API Service - Used by both Browse and Dashboard
Solution: Collab #1 creates googleBooks.ts, Collab #2 uses it

##Navbar with User Profile - Both need to modify
Solution: Create together in Task 4, then Collab #1 adds user display

##Feed Auto-generation - Triggered by book status changes (Collab #2's domain)
Solution: Collab #2 calls feed store actions when updating book status

#Recommended Workflow

##Phase 1: Foundation (Days 1-2, Both Together)
- [ ] Task 1: Project Init (1 person sets up, both clone)- [ ] Task 2: All TypeScript types (pair programming)- [ ] Task 3: Zustand stores (split by domain, review together)- [ ] Task 4: Layout components (pair programming)

##Phase 2: Parallel Development (Days 3-5)
Collab #1:- [ ] Task 5: Login page- [ ] Task 6: Browse + API integration- [ ] Create BookCard.tsx (shared)- [ ] Task 9A: Community FeedCollab #2:- [ ] Task 7: Dashboard (uses API from Collab #1)- [ ] Task 8: My Books with DnD- [ ] Task 9B: Book Details page

##Phase 3: Integration & Testing (Days 6-7, Both)
- [ ] Merge all features- [ ] Task 10: Testing together- [ ] Fix integration issues- [ ] Deploy to GitHub Pages
