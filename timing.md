&nbsp;\*\*7-day sprint execution plan\*\* perfectly aligned with your PRD and `feature-implementation-tracker.md`.



This plan breaks each day into \*\*focused deliverables\*\*, \*\*file targets\*\*, \*\*acceptance criteria\*\*, and \*\*end-of-day validation checks\*\* to ensure you stay on track for a fully deployable, polished MVP by \*\*Day 7\*\*.



---



\# 🚀 Codex Collective — 7-Day Implementation Plan



\*\*Goal:\*\* Complete a fully responsive, interactive, deployable MVP by Day 7

\*\*Stack:\*\* React 18 + Vite + TypeScript + React Router DOM + Zustand + Tailwind CSS + Google Books API



---



\## 🗓️ \*\*Day 1 — Project Setup \& Core Scaffolding\*\*



\*\*Focus:\*\* Get the environment, routing, and layout in place.



\### Tasks



| Area          | Deliverable                                                                            |

| ------------- | -------------------------------------------------------------------------------------- |

| Vite Setup    | `npm create vite@latest codex-collective --template react-ts`                          |

| Packages      | Install `react-router-dom`, `zustand`, `@dnd-kit/core`, `tailwindcss`, `clsx`          |

| Tailwind Init | `npx tailwindcss init -p` and configure theme colors (pastel + teal)                   |

| Routing       | `/login`, `/`, `/my-books`, `/book/:id`, `/feed`, `/browse`                            |

| Layout        | `Navbar.tsx`, `Footer.tsx`, `Layout.tsx` with mobile hamburger menu                    |

| Git Setup     | Initialize repo, `.gitignore`, commit conventions (`feat:`, `fix:`), create dev branch |



\### Acceptance Criteria



\* ✅ App builds and runs locally (`npm run dev`)

\* ✅ Layout renders header/footer on all routes

\* ✅ Navbar collapses on small screens

\* ✅ Tailwind theme compiled without errors



---



\## 🗓️ \*\*Day 2 — Context, State Management (Zustand + LocalStorage)\*\*



\*\*Focus:\*\* Build the store layer before UI integration.



\### Tasks



| Area        | Deliverable                                                    |

| ----------- | -------------------------------------------------------------- |

| Context     | `BookCollectionContext.tsx` with reducer + interfaces          |

| Zustand     | `src/store/books.ts`, `src/store/user.ts`, `src/store/feed.ts` |

| Persistence | `hooks/useLocalStorage.ts` syncs Zustand → LocalStorage        |

| Validation  | Add Zod schemas for stored data (`schemas.ts`)                 |



\### Acceptance Criteria



\* ✅ Books, user, and feed slices compile with TS types

\* ✅ State persists and reloads on refresh

\* ✅ No console warnings in reducer actions

\* ✅ Tests: adding/removing books updates store correctly



---



\## 🗓️ \*\*Day 3 — Google Books API Integration + Search UI\*\*



\*\*Focus:\*\* Implement search, API calls, and add-to-collection flow.



\### Tasks



| Area           | Deliverable                                                                     |

| -------------- | ------------------------------------------------------------------------------- |

| API            | Fetch Google Books via `https://www.googleapis.com/books/v1/volumes?q=${query}` |

| Components     | `BookSearch.tsx`, `BookCard.tsx` grid layout                                    |

| Context Update | Add `searchBooks()` and `clearSearch()` actions                                 |

| Loading UI     | “Loading…” + empty-state components                                             |



\### Acceptance Criteria



\* ✅ API returns results within 3 s

\* ✅ “Add to Collection” stores book in Zustand/LocalStorage

\* ✅ Error + empty states handled gracefully

\* ✅ Debounced input ≤ 300 ms



---



\## 🗓️ \*\*Day 4 — My Books Page + Drag-and-Drop Shelf\*\*



\*\*Focus:\*\* Build interactive bookshelf with status updates.



\### Tasks



| Area           | Deliverable                                  |

| -------------- | -------------------------------------------- |

| Tabs           | `Tabs.tsx` for Want / Reading / Read         |

| DnD            | `BookshelfGrid.tsx` using `@dnd-kit/core`    |

| Status         | Update book status via drag → Zustand update |

| Dashboard Sync | Recompute challenge progress                 |



\### Acceptance Criteria



\* ✅ Books draggable between lists

\* ✅ Status persists on reload

\* ✅ Dashboard progress auto-updates

\* ✅ Keyboard DnD works (Space + Arrow)



---



\## 🗓️ \*\*Day 5 — Book Details Page + Dynamic Routing\*\*



\*\*Focus:\*\* Route to individual book pages with details and charts.



\### Tasks



| Area      | Deliverable                                               |

| --------- | --------------------------------------------------------- |

| Routing   | `/book/:id` via `useParams()`                             |

| Component | `BookDetailsPage.tsx`, `BookDetails.tsx`                  |

| Chart     | Add Recharts bar chart for ratings                        |

| Actions   | “Want to Read” / “Currently Reading” buttons update store |



\### Acceptance Criteria



\* ✅ Route works for all stored books

\* ✅ Chart renders (if data present)

\* ✅ Back button navigates properly

\* ✅ Missing data handled (“Unknown Author”)



---



\## 🗓️ \*\*Day 6 — Dashboard \& Community Feed\*\*



\*\*Focus:\*\* Tie everything together; enable social updates.



\### Tasks



| Area      | Deliverable                                              |

| --------- | -------------------------------------------------------- |

| Dashboard | Show challenge progress, recently added, recommendations |

| Feed      | `FeedPage.tsx`, `FeedCard.tsx` with likes/comments       |

| Sync      | Auto-generate feed posts on status change                |

| UI        | Polish with Tailwind hover/focus states                  |



\### Acceptance Criteria



\* ✅ Feed persists in LocalStorage

\* ✅ Likes/comments update instantly

\* ✅ Dashboard lists accurate

\* ✅ Lighthouse ≥ 90 Accessibility



---



\## 🗓️ \*\*Day 7 — Testing, Polish \& Deployment\*\*



\*\*Focus:\*\* QA, docs, CI/CD pipeline, final deploy.



\### Tasks



| Area           | Deliverable                                                       |

| -------------- | ----------------------------------------------------------------- |

| Testing        | Basic Vitest + React Testing Library coverage                     |

| Docs           | Finalize `PRD.md`, `epic.md`, `feature-implementation-tracker.md` |

| GitHub Actions | `.github/workflows/deploy.yml` or Vercel connect                  |

| QA             | Mobile test (iPhone/Android), desktop test                        |

| Deployment     | `npm run build` → deploy to GitHub Pages or Vercel                |



\### Acceptance Criteria



\* ✅ CI/CD build passes with no warnings

\* ✅ All core routes functional

\* ✅ Responsive design verified across breakpoints

\* ✅ Documentation 100 % complete



---



\## 📊 Progress Tracker (Daily Snapshot)



| Day | Major Milestone     | Status |

| --- | ------------------- | ------ |

| 1   | Setup + Layout      | ☐      |

| 2   | State + Persistence | ☐      |

| 3   | Google API Search   | ☐      |

| 4   | My Books DnD        | ☐      |

| 5   | Book Details        | ☐      |

| 6   | Dashboard + Feed    | ☐      |

| 7   | Tests + Deploy      | ☐      |



(Replace ☐ → 🛠 In Progress → ✅ Done as you progress.)



---



\## 🧩 Key Validation Checkpoints



| Checkpoint      | Verification Method                                    |

| --------------- | ------------------------------------------------------ |

| API Integration | Run search; confirm Google Books JSON mapped correctly |

| LocalStorage    | Refresh → verify books persist                         |

| Routing         | Deep link to `/book/:id` works directly                |

| DnD             | Book status updates and Dashboard bar changes          |

| Feed            | Like/comment updates instantly                         |

| Deployment      | Live build accessible and mobile responsive            |



---



\## ⚙️ Git \& PR Flow



1\. Create branch per feature: `feature/<epic>-<short-desc>`

2\. Commit messages use Conventional Commits (`feat:`, `fix:`, `docs:`).

3\. Open PR → review → merge to `main`.

4\. Merge to main triggers build/deploy workflow.



---



\## ✅ Definition of Done



A feature is \*\*Done\*\* when:



\* All related acceptance criteria = met

\* Code merged via reviewed PR

\* Tests pass + no console warnings

\* Feature verified in live deployment

\* Docs updated (PRD, epic, tracker)



---



\## ⏰ Completion Target



> \*\*Project Deadline:\*\* 7 Days (1 Week Sprint)

> \*\*Deliverable:\*\* Deployed MVP of Codex Collective with Google Books API integration, interactive My Books DnD shelf, and social feed.



---



Would you like me to generate a \*\*lightweight “Daily Stand-Up Template.md”\*\* next (for quick daily progress notes \& blockers you can drop into your repo or Notion)?



