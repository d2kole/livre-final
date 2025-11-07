Product Requirements Document (PRD)** for the **Codex Collective** application, enhanced to include full Google Books API integration, interactive UX, LocalStorage persistence, TypeScript interfaces, and all best practices from your prior specs.


# 📘 Product Requirements Document (PRD)

## **Codex Collective: A Social Book Discovery and Tracking App**

---

### I. Overview

| Attribute             | Description                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Product Type**      | Social Reading & Book Tracking Web Application                                                                                                                        |
| **Goal**              | Build a modern, interactive, and socially engaging platform for users to **search**, **track**, and **share** books — integrating **Google Books API** for discovery. |
| **Tech Stack**        | React 18, TypeScript, Vite, React Router DOM, Zustand (new tech), Tailwind CSS, LocalStorage                                                                          |
| **Deployment Target** | GitHub Pages                                                                                                                                   |
| **New Technology**    | **Zustand** for global state management                                                                                                                               |
| **Design Language**   | Light, modern UI with neutral pastel backgrounds and teal accents (`#2E8B57`)                                                                                         |
| **Inspiration**       | Goodreads                                                                                                                                   |

---

### II. Core Objectives

1. **Empower Book Discovery:** Integrate Google Books API to search, view, and save titles.
2. **Simplify Reading Management:** Track progress with “Want to Read,” “Currently Reading,” and “Read” lists.
3. **Build a Social Layer:** Like, comment, and share updates in a community feed.
4. **Deliver Seamless UX:** Fully responsive UI, drag-and-drop interactions, and persistent LocalStorage state.
5. **Ensure Engineering Excellence:** Follow Git hygiene, PR workflow, and CI/CD deployment readiness.

---

### III. Core Features

| Feature                      | Description                                                            | Interaction                     |
| ---------------------------- | ---------------------------------------------------------------------- | ------------------------------- |
| **Login (Local)**            | Lightweight username input stored in LocalStorage                      | Immediate redirect to Dashboard |
| **Dashboard**                | Displays reading challenge progress, recent books, and recommendations | Dynamic, auto-updates           |
| **Book Search (Google API)** | Search via Google Books API and add to collection                      | Search, view, add               |
| **My Books**                 | Books organized in tabs by status (Want / Reading / Read)              | Drag-and-drop + persistence     |
| **Book Details**             | Shows metadata, reviews, and add-to-list CTAs                          | Dynamic route `/book/:id`       |
| **Community Feed**           | Displays activity stream, likes, and comments                          | Like / comment actions          |
| **Responsive Layout**        | Header, footer, and mobile hamburger menu                              | Adaptive design                 |
| **State & Persistence**      | Zustand + LocalStorage for offline persistence                         | Automatic sync                  |

---

### IV. Best Practices & Definitions (80/20 Quick Wins)

| Concept              | Definition                   | Best Practice                             | Syntax Example                                                   |
| -------------------- | ---------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| **Vite**             | Fast build tool for React/TS | Use React-TS template                     | `npm create vite@latest codex-collective --template react-ts`    |
| **Zustand**          | Lightweight global store     | Keep slices small & composable            | `create((set)=>({books:[],addBook:b=>set(...)}))`                |
| **LocalStorage**     | Browser persistence          | Store minimal JSON, version keys          | `localStorage.setItem('codex:v1:books', JSON.stringify(data))`   |
| **Tailwind CSS**     | Utility-first styling        | Use responsive classes (`md:grid-cols-3`) | `<div className="grid md:grid-cols-3 gap-4">`                    |
| **React Router DOM** | SPA routing                  | Use `useNavigate` and `useParams`         | `<Route path="/book/:id" element={<BookDetails/>}/>`             |
| **Google Books API** | REST API to fetch book data  | Fetch volumes via query                   | `GET https://www.googleapis.com/books/v1/volumes?q=harry+potter` |
| **Accessibility**    | Keyboard navigation + ARIA   | Add `tabIndex` & `aria-label`             | `<button aria-label="Add Book">+</button>`                       |

---

### V. Functional Specifications

#### 1. Login (`/login`)

**Purpose:** Lightweight onboarding with local profile.

**Requirements:**

* Input: username (required)
* On submit → save `{ id, username }` to LocalStorage (`codex:v1:user`)
* Redirect to `/`

**Acceptance Criteria:**

* Empty input shows inline error
* LocalStorage key `codex:v1:user` created
* Unauthenticated users redirected to `/login`

---

#### 2. Dashboard (`/`)

**Purpose:** Central hub with reading progress, latest books, and recommendations.

**Requirements:**

* Reading Challenge progress bar (computed from “Read” list)
* Horizontal carousel of recent additions
* Suggested books from Google API (based on keywords from user’s genres)

**Acceptance Criteria:**

* Progress recalculates after every status change
* Carousel scrollable/drag-enabled on all devices
* Recommendations clickable → navigates to Book Details

---

#### 3. Google Books Search (`/browse`)

**Purpose:** Integrate Google Books API to search and display books.

**Workflow:**

1. User enters query
2. API call → `https://www.googleapis.com/books/v1/volumes?q=${query}`
3. Map response to `Book` interface
4. Display results with “Add to Collection” button

**Syntax Example:**

```tsx
const res = await fetch(
  `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
)
const data = await res.json()
const results = data.items.map(item => ({
  id: item.id,
  title: item.volumeInfo.title,
  authors: item.volumeInfo.authors || ['Unknown'],
  thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
  description: item.volumeInfo.description || '',
}))
```

**Acceptance Criteria:**

* Debounced search (≤ 300 ms)
* Loading + empty states handled
* Add button persists book to collection in LocalStorage

---

#### 4. My Books (`/my-books`)

**Purpose:** Categorize user’s collection by status.

**Requirements:**

* Tabs: Want to Read | Currently Reading | Read
* 3-row bookshelf grid
* Drag-and-drop (via `dnd-kit`) between lists
* Zustand state synced with LocalStorage

**Acceptance Criteria:**

* Dragging updates book status instantly
* State persists after page refresh
* Keyboard DnD available (Space + Arrow keys)
* Accessible ARIA announcements for moves

---

#### 5. Book Details (`/book/:id`)

**Purpose:** Show individual book information.

**Requirements:**

* Data: title, author, genre, pages, publish date, description
* Add buttons for “Want to Read” or “Currently Reading”
* Ratings chart using Recharts (optional if no ratings)

**Acceptance Criteria:**

* Dynamic route works for both local and API-fetched books
* Back button navigates to previous page
* Missing data gracefully defaults (“Unknown Author”)

---

#### 6. Community Feed (`/feed`)

**Purpose:** Display friend updates.

**Requirements:**

* Cards show “X finished reading Y” or “Z started reading A”
* Like/comment buttons update LocalStorage feed slice
* Feed auto-updates when user changes book status

**Acceptance Criteria:**

* Likes increment instantly (optimistic UI)
* Comments appear inline without refresh
* Each post links to Book Details

---

#### 7. Global Layout

**Requirements:**

* Header (logo + nav links: Home, My Books, Feed, Discover)
* Footer (credits + contact)
* Mobile hamburger → dropdown (Tailwind + `aria-expanded`)

**Acceptance Criteria:**

* Navbar collapses below `md` breakpoint
* Menu toggles with keyboard (Enter/Space)
* Focus trapped in open menu

---

### VI. Technical Specification

| Area                      | Technology                     | Details                                                     |
| ------------------------- | ------------------------------ | ----------------------------------------------------------- |
| **Framework**             | Vite + React 18 + TypeScript   | Fast dev server & TS safety                                 |
| **Routing**               | React Router DOM v6            | `/`, `/book/:id`, `/my-books`, `/feed`, `/browse`           |
| **State Mgmt (New Tech)** | Zustand                        | Lightweight global state + slices (`books`, `user`, `feed`) |
| **Styling**               | Tailwind CSS                   | Responsive utilities + accessible colors                    |
| **Persistence**           | LocalStorage                   | Store lists, user, feed; version key `codex:v1`             |
| **Drag & Drop**           | `@dnd-kit/core`                | Accessible DnD                                              |
| **Charts**                | Recharts                       | Rating breakdown + reading challenge                        |
| **Validation**            | Zod                            | Validate LocalStorage schema                                |
| **Testing**               | Vitest + React Testing Library | Unit + integration coverage                                 |
| **Deployment**            | GitHub Pages / Vercel          | SPA fallback configured                                     |
| **Accessibility**         | ARIA roles, tab order          | Lighthouse ≥ 90 Accessibility                               |

---

### VII. Folder Structure

```
src/
├─ components/
│  ├─ BookSearch.tsx
│  ├─ BookCollection.tsx
│  ├─ BookDetails.tsx
├─ context/
│  └─ BookCollectionContext.tsx
├─ pages/
│  ├─ DashboardPage.tsx
│  ├─ MyBooksPage.tsx
│  ├─ BookDetailsPage.tsx
│  ├─ FeedPage.tsx
│  └─ BrowsePage.tsx
├─ store/
│  ├─ books.ts
│  ├─ user.ts
│  └─ feed.ts
├─ hooks/
│  ├─ useLocalStorage.ts
│  └─ useDebounce.ts
└─ App.tsx
```

---

### VIII. Acceptance Criteria Summary

✅ **Interactive UX:**

* Drag-and-drop bookshelf
* Scrollable carousels
* Likes/comments update instantly

✅ **LocalStorage Persistence:**

* All data persisted with `codex:v1` key schema

✅ **Google Books API Integration:**

* Real-time search results from API
* Add to collection button functional

✅ **Polished UI:**

* Tailwind components with responsive breakpoints

✅ **Deployable:**

* `vite build` → deploy via GitHub Pages or Vercel

✅ **New Tech:**

* Zustand store with Zod validation

✅ **Documentation:**

* `PRD.md` and `epic.md` included

---

### IX. Example Code Snippets

**Book Collection Interface (TypeScript)**

```ts
export interface BookCollectionState {
  books: Book[]
  isLoading: boolean
  error: string | null
  searchResults: Book[]
  currentlyReading: Book[]
  wantToRead: Book[]
  haveRead: Book[]
}
```

**Google Books Search Function**

```ts
async function searchBooks(query: string) {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  )
  const data = await res.json()
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || ['Unknown'],
    description: item.volumeInfo.description || '',
    thumbnail: item.volumeInfo.imageLinks?.thumbnail,
  }))
}
```

**Book Details Routing**

```tsx
<button 
  onClick={() => navigate(`/book/${book.id}`)}
  className="bg-teal-600 text-white px-3 py-1 rounded"
>
  View Details
</button>
```

---

### X. Major Epics & User Stories (Summary)

| Epic                                | Description                     | Acceptance                                      |
| ----------------------------------- | ------------------------------- | ----------------------------------------------- |
| **EPIC 1: Onboarding & Dashboard**  | Local login + progress overview | User saved to LocalStorage, Dashboard dynamic   |
| **EPIC 2: Book Management**         | Add, drag, categorize books     | Zustand + LocalStorage persistence              |
| **EPIC 3: Google API Search**       | Search & add books via API      | API fetch success, results mapped to Book model |
| **EPIC 4: Book Details**            | View metadata, ratings, reviews | Dynamic route `/book/:id` works                 |
| **EPIC 5: Community Feed**          | Social actions (likes/comments) | Feed updates instantaneously                    |
| **EPIC 6: Responsiveness & Layout** | Header/footer, hamburger nav    | Layout adapts per breakpoint                    |
| **EPIC 7: State & Persistence**     | LocalStorage + Zod schema       | Reload restores state without errors            |
| **EPIC 8: Repo Governance**         | Git hygiene + CI/CD deploy      | PRs reviewed, auto-deploys successful           |

---

### XI. Git Workflow Standards

| Practice               | Rule                                                 |
| ---------------------- | ---------------------------------------------------- |
| **Branching**          | `feature/*`, `fix/*`, `docs/*`                       |
| **Commits**            | Conventional format: `feat: add Google Books search` |
| **Pull Requests**      | Required for all merges to `main`                    |
| **Protected Branches** | `main` locked; PR review required                    |
| **Deployment Trigger** | Merge → build + deploy via GitHub Actions or Vercel  |

---

### XII. Non-Functional Requirements

| Category          | Target                              |
| ----------------- | ----------------------------------- |
| **Performance**   | Lighthouse ≥ 90 Performance score   |
| **Accessibility** | Keyboard nav + ARIA labels          |
| **Security**      | No sensitive API keys; use env vars |
| **Resilience**    | Handle missing data gracefully      |
| **Usability**     | Mobile-first responsive UI          |

---

### XIII. Milestones

| Phase | Deliverable                                 | Duration |
| ----- | ------------------------------------------- | -------- |
| M1    | Scaffolding + Layout (Header/Footer/Login)  | 1 days   |
| M2    | State + LocalStorage setup (Zustand + Zod)  | 1 days   |
| M3    | Google Books API integration + Search Page  | 1 days   |
| M4    | My Books (DnD) + Dashboard linking          | 1 days   |
| M5    | Feed + Social Interactions                  | 1 days   |
| M6    | Testing, Docs (`PRD.md`, `epic.md`), Deploy | 1 days   |

---

### XIV. Definition of Done (DoD)

A feature is considered **Done** when:

* [ ] Acceptance Criteria met
* [ ] Code reviewed & merged via PR
* [ ] Tests passing
* [ ] No console warnings
* [ ] Deployed build verified on target domain
* [ ] Documentation updated

---

### XV. Future Enhancements (Stretch Goals)

* Dark mode toggle
* AI-based book recommendations using OpenAI Embeddings

---

✅ **End of Document**
**Codex Collective — PRD v1.1 (with Google Books API integration)**

---

