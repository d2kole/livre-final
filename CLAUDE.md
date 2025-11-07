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

### Overview

**Target**: GitHub Pages at https://d2kole.github.io/livre-final/
**Repository**: https://github.com/d2kole/livre-final
**Build Command**: `npm run build`
**Deploy Trigger**: Merge to `main` branch via GitHub Actions
**Base Path**: `/livre-final/` (configured in vite.config.ts)

### Project Structure

The project has a **nested structure**:
```
ucf-finalproject/              (root repository)
├── codex-collective/          (actual Vite app - needs to be deployed)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── .github/workflows/deploy.yml
├── package.json               (root-level package.json)
└── other files...
```

**Important**: The deployable app is in the `codex-collective/` subdirectory, not the root.

### Deployment Strategy: Two Options

#### Option 1: Deploy from Root (Recommended)

Move the GitHub Actions workflow to the **root** `.github/workflows/` directory and configure it to build from the `codex-collective/` subdirectory.

**Steps**:

1. **Move the workflow file**:
```bash
# Create root .github/workflows directory if it doesn't exist
mkdir -p .github/workflows

# Move the workflow from subdirectory to root
mv codex-collective/.github/workflows/deploy.yml .github/workflows/deploy.yml
```

2. **Update the workflow file** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./codex-collective  # KEY CHANGE: Set working directory
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: './codex-collective/package-lock.json'  # KEY CHANGE

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './codex-collective/dist'  # KEY CHANGE: Point to subdirectory

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Commit and push**:
```bash
git add .github/workflows/deploy.yml
git commit -m "chore: move GitHub Actions workflow to root for proper deployment"
git push origin main
```

#### Option 2: Restructure Project (Alternative)

Move all files from `codex-collective/` to the root directory.

**Steps**:

1. **Move all files to root**:
```bash
# From ucf-finalproject/ directory
cp -r codex-collective/* .
cp codex-collective/.github .github  # Copy hidden directories
```

2. **Update vite.config.ts** (already correct with `base: '/livre-final/'`)

3. **Clean up**:
```bash
rm -rf codex-collective/  # Remove now-empty subdirectory
git add .
git commit -m "chore: restructure project to deploy from root"
git push origin main
```

### Manual Deployment (Testing)

To manually test the build before deploying:

```bash
# Navigate to the app directory
cd codex-collective

# Install dependencies
npm ci

# Build for production
npm run build

# Preview the build locally
npm run preview
```

**Verify the build**:
- Check that `dist/` folder is created
- Test the preview at `http://localhost:4173`
- Verify all routes work with SPA routing

### GitHub Pages Configuration

1. **Enable GitHub Pages**:
   - Go to https://github.com/d2kole/livre-final/settings/pages
   - Source: **GitHub Actions**
   - Branch: Not needed (Actions handles deployment)

2. **Verify base path**:
   - Confirm `vite.config.ts` has `base: '/livre-final/'`
   - This matches the repository name for proper asset loading

3. **SPA Routing Configuration**:
   The build automatically handles SPA routing via Vite. No additional configuration needed since GitHub Actions deploys the full `dist/` folder.

### Post-Deployment Verification

After deployment completes:

1. **Check Actions tab**: https://github.com/d2kole/livre-final/actions
   - Verify workflow ran successfully
   - Check for any error messages

2. **Test the deployed site**: https://d2kole.github.io/livre-final/
   - Verify all pages load
   - Test routing (refresh on `/browse`, `/my-books`, etc.)
   - Check that images and assets load correctly

3. **Inspect browser console**:
   - No 404 errors for assets
   - No CORS errors
   - No routing errors

### Troubleshooting

**404 on refresh (SPA routing issue)**:
- Verify `base: '/livre-final/'` in vite.config.ts
- Check that GitHub Actions uploaded the full `dist/` folder

**Assets not loading (wrong base path)**:
- Confirm base path matches repository name
- Check browser DevTools Network tab for failed requests

**Workflow fails on npm ci**:
- Verify `package-lock.json` is committed
- Check Node version matches (v20)

**Build fails on lint**:
- Run `npm run lint` locally to fix errors
- Consider adding `--max-warnings 0` to enforce zero warnings

### Continuous Deployment Workflow

Once configured, the deployment is automatic:

1. **Make changes** to code in `codex-collective/src/`
2. **Commit and push** to `main` branch
3. **GitHub Actions automatically**:
   - Installs dependencies
   - Runs linting
   - Builds the production bundle
   - Deploys to GitHub Pages
4. **Site updates** within 2-3 minutes

### Important Notes

- **Current status**: Workflow exists at `codex-collective/.github/workflows/deploy.yml` but needs to be moved to root or project restructured
- **Base path**: Already configured correctly for `/livre-final/` deployment
- **Branch protection**: Consider protecting `main` branch and requiring PR reviews
- **Secrets**: No API keys needed (Google Books API is open, LocalStorage is client-side)
- **Cache clearing**: Users may need to clear cache after major updates

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
