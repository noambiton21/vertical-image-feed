# Implementation Plan

The full brief is in [ASSIGNMENT.md](./ASSIGNMENT.md). This doc is the plan I built against:
the decisions, the architecture, and the phases. It's meant to stand on its own — setup and
run steps live in the root [README](../README.md).

## What I'm building

A full-screen, vertically-scrolling, snap-to-photo feed — TikTok/Reels but for photos. One
image per viewport that snaps on scroll/swipe/arrow keys, infinite pagination that loads the
next batch before the end, and a single Like per photo that persists across refresh. Mobile
first (~390px), adapting up to tablet and desktop. The whole thing is one screen, one flow.

## Decisions

- **Stack:** React + Vite + TypeScript + Tailwind + TanStack Query on the client; Node +
  Express + TypeScript (layered) on the server; SQLite via better-sqlite3.
- **Image API: Unsplash.** It needs an Access Key sent as a header, so the key lives on the
  server and the client never calls Unsplash directly — which is exactly why the proxy has to
  exist. The server fetches a page, normalizes it to the few fields the UI needs, and returns
  those. Key comes from `.env` (`UNSPLASH_ACCESS_KEY`) with a committed `.env.example`; the
  real key never enters git.
- **UI is minimal:** just the photo and one Like (heart). No photographer name, caption,
  location, avatar, or like count — the photo is the hero. (Unsplash's guidelines ask for a
  photographer credit; I deliberately keep the overlay clean for this single-screen demo and
  note the trade-off in the README. In a real product I'd add the credit back.)
- **Likes are global and anonymous** (no auth): a like is a server-stored fact about a photo
  id, shown as filled/outlined with no count. Persisted in SQLite, hydrated on load.
- **End of feed is natural:** the feed paginates lazily and stops when a short page comes
  back. No wrap, no fake infinite.
- **Stretch (after the core):** smart preloading, double-tap-to-like.

## Architecture

```
Browser (client)                         Node + Express (server)              Unsplash
React + Vite + TS + Tailwind             routes → controllers → services
TanStack Query (feed + likes)   /api/*   ├─ photos.service (merges)  Client-ID
local React state (index, ui)  ───────▶  ├─ unsplash.service ───────────────▶ GET /photos
                                         └─ likes.repo ──▶ SQLite (likes on disk)
```

### Backend layers

Dependencies point only downward: **routes → controllers → services → (repo | unsplash)**.

- **routes** — wire a verb + path to a controller. No logic.
- **controllers** — validate input, call one service, shape the response. No SQL, no `fetch`,
  no merging.
- **services** — the decisions.
  - `unsplash.service` is the only place that talks to Unsplash: fetch, normalize each item
    to `Photo`, translate failures into typed errors.
  - `photos.service` gets a page from `unsplash.service` and the liked set from `likes.repo`,
    then merges `liked = likedSet.has(id)`. This merge is the real business logic, in one place.
  - `likes.service` validates the id and sets/unsets via the repo.
- **repo** — the only place SQL lives.

One terminal error middleware maps `AppError` to `{ error: message }` + status, so nothing
leaks a stack trace.

### Folder structure

The full tree. Files land with the phase that needs them — empty folders aren't pre-created.

```
volindo/
├─ docs/                         ASSIGNMENT.md, IMPLEMENTATION_PLAN.md, PROGRESS.md
├─ .env.example                  env template (real .env is gitignored)
├─ .gitignore
├─ .prettierrc, .prettierignore
├─ package.json                  root scripts: dev (concurrently), build, install:all, format
├─ README.md
├─ AI_WORKFLOW.md                (Phase 10)
├─ server/
│  ├─ package.json, tsconfig.json
│  └─ src/
│     ├─ server.ts               app.listen(env.PORT)
│     ├─ app.ts                  express app: json, routes, error middleware (last)
│     ├─ config/
│     │  └─ env.ts               parse + validate process.env; throws on boot if invalid
│     ├─ constants.ts            server-side consts (defaults, clamps, timeouts)
│     ├─ routes/
│     │  ├─ index.ts             mounts /api/*
│     │  ├─ photos.routes.ts
│     │  └─ likes.routes.ts      (Phase 2)
│     ├─ controllers/
│     │  ├─ photos.controller.ts parse + validate params, call service, respond
│     │  └─ likes.controller.ts  (Phase 2)
│     ├─ services/
│     │  ├─ unsplash.service.ts  fetch Unsplash, normalize to Photo, throw AppError
│     │  ├─ photos.service.ts    page from unsplash + liked set from repo → merge (Phase 2)
│     │  └─ likes.service.ts     validate + set/unset via repo (Phase 2)
│     ├─ db/                     (Phase 2)
│     │  ├─ connection.ts        better-sqlite3 singleton + schema on boot
│     │  └─ likes.repo.ts        the only place SQL lives
│     ├─ middleware/
│     │  └─ errorHandler.ts      AppError → { error: message } + status
│     ├─ errors/
│     │  └─ AppError.ts          AppError(status, message) for HTTP error responses
│     └─ types/
│        └─ photo.ts             Photo DTO + Unsplash raw response types
└─ client/
   ├─ index.html, vite.config.ts (proxy /api → server; port from .env), tailwind.config.ts
   ├─ package.json, tsconfig.json
   └─ src/
      ├─ main.tsx                QueryClientProvider + <App/>
      ├─ App.tsx                 <Feed/> + error boundary
      ├─ index.css               tailwind layers, hidden scrollbar, reduced-motion base
      ├─ constants.ts            client consts: image dims, breakpoints, sentinel margin,
      │                          double-tap window, query keys base, sizes
      ├─ types/
      │  └─ photo.ts             Photo, PhotosPage, ApiError (mirror the server DTO)
      ├─ lib/
      │  ├─ api.ts               fetch wrapper + error-envelope parse → ApiError
      │  ├─ queryKeys.ts         typed query-key factory
      │  └─ blurhash.ts          blur_hash → data URL
      ├─ hooks/
      │  ├─ usePhotosFeed.ts     useInfiniteQuery + getNextPageParam
      │  ├─ useToggleLike.ts     optimistic mutation + flipLikedInPages
      │  ├─ useIntersection.ts   IO sentinel (root = scroll container)
      │  ├─ usePreloadNext.ts    preload next 1–2 images (Phase 9)
      │  └─ useDoubleTap.ts      double-tap detection (Phase 9)
      └─ components/
         ├─ Feed.tsx             scroll-snap container; flattens pages; switches states
         ├─ PhotoSlide.tsx       one 100dvh viewport: image + like (+ burst)
         ├─ BlurHashImage.tsx    blurhash placeholder → real img fade-in
         ├─ LikeButton.tsx       real <button>, aria-pressed/label
         ├─ HeartBurst.tsx       double-tap animation (Phase 9)
         └─ states/
            ├─ FeedSkeleton.tsx
            ├─ EmptyState.tsx
            ├─ ErrorState.tsx    branches on ApiError code
            └─ EndOfFeed.tsx
```

### Photo DTO

Unsplash returns far more than the UI needs; normalization cuts it to:

```ts
interface Photo {
  id: string;
  url: string; // urls.raw + "&w=1080&fit=crop&q=80" (server owns sizing)
  width: number; // for an aspect-ratio box (no layout shift)
  height: number;
  blurHash: string | null; // Unsplash blur_hash → instant placeholder; null-safe
  liked: boolean; // merged from SQLite — the only reason /api/photos hits the DB
}
```

### API (base `/api`, JSON)

- `GET /api/photos?page=1&per_page=8` — `page` ≥1, `per_page` 1–30. The controller parses the
  params (missing → defaults, present → `Number(...)`) and throws `400` if `page`/`per_page`
  isn't a valid in-range integer, so a bad value never reaches Unsplash. →
  `{ page, perPage, items: Photo[] }`. "Has more" is inferred from `items.length === perPage`
  (Unsplash has no total usable as a cursor).
- `PUT /api/photos/:id/like` → `{ id, liked: true }` · `DELETE /api/photos/:id/like` →
  `{ id, liked: false }`. Idempotent set semantics, so optimistic retries and double-tap
  races are safe. (Phase 2)
- Errors: a terminal middleware returns `{ error: message }` with the right status — `400`
  for bad params/JSON, `502` for any Unsplash failure (network, timeout, non-OK, bad body),
  `500` as the catch-all. `AppError(status, message)` carries both; anything else falls back
  to a generic 500 with no stack leak. (A richer envelope with a machine-readable `code` and a
  distinct `429` rate-limit mapping is deferred to Phase 3 if the client needs to branch on it.)

### SQLite

```sql
CREATE TABLE IF NOT EXISTS likes (
  photo_id   TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
```

Row existence == liked (no boolean column, no count). `INSERT ... ON CONFLICT DO NOTHING`
(like), `DELETE` (unlike), `SELECT ... WHERE photo_id IN (...)` → a `Set` for the feed merge.
Schema ensured on boot.

### The hard parts

- **Snap + infinite without jumps.** CSS-native snap (`snap-y snap-mandatory`, slide
  `snap-start snap-always`, height `100dvh` not `vh`). Append-only render (`pages.flatMap`,
  stable `key={photo.id}`, every slide one viewport) so the scroll offset never moves. A
  zero-height sentinel as the last child, observed with `root` = the scroll container and a
  `rootMargin` so the next page fetches ~a viewport early; `fetchNextPage` only fires on
  `isIntersecting && hasNextPage && !isFetchingNextPage`. A short page ends the feed.
- **No white flash.** First load (no data) → a shimmer skeleton. Per image (data known, bytes
  loading) → the blur_hash decoded to a tiny placeholder, real image fades in on load;
  `aspect-ratio` from width/height reserves the box.
- **Likes.** `liked` ships inside each Photo (merged server-side), so a refresh restores likes
  for free — no separate likes query. The toggle is optimistic: flip the cached value on
  mutate, roll back on error, and don't refetch on settle (that would reshuffle Unsplash's
  random order and jump the scroll).

### Design tokens

- accent `#ff4d6d` (active like only) · bg `#0a0a0c` · slide-bg `#15151a` · white overlay text
- font: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif`
- readability gradient: `linear-gradient(to bottom, rgba(0,0,0,.42) 0%, transparent 16%, transparent 52%, rgba(0,0,0,.28) 74%, rgba(0,0,0,.82) 100%)`
- heart: 24×24 SVG, stroke-width 1.7, round caps — outlined white → filled coral
- animations: `shimmer` (skeleton), `heartPop` (tap), `burstHeart` (double-tap), `fadeUp` (empty/error)
- responsive: mobile full-bleed; tablet/desktop = centered ~460px column on a blurred zoomed
  backdrop (`blur(38px) brightness(.55) saturate(1.2) scale(1.25)` + `rgba(8,8,11,.45)`);
  desktop moves the heart just outside the column

### Accessibility

Real `<button>` heart with `aria-label` + `aria-pressed`; meaningful image `alt`, decorative
layers `aria-hidden`; `prefers-reduced-motion` suppresses the animations while state still
changes; arrow-key navigation.

## Code conventions

These hold for every phase.

- **No `any`.** TypeScript runs in `strict` mode and `any` is banned. A type assertion
  (`as UnsplashPhoto[]`) is used for the Unsplash response — a stable, documented external API
  where a runtime guard would add complexity without proportional benefit; failures are caught
  and logged with request context instead. Enforced by `tsc` + review.
- **No AI-style comments.** No "generated by", "TODO", "FIXME", "placeholder", "future work",
  no banner/section dividers, no comments that just restate the code. A comment only earns its
  place when the _why_ isn't obvious from the code — and then it explains the why, briefly.
- **Enums / const objects over loose strings.** Anything with a fixed set of values is an enum
  or a `const` object — query-key roots, named breakpoints. No bare string literals for these
  scattered around the code.
- **No magic numbers or strings — name them.** Anything meaningful or reused is a named const
  (`server/src/constants.ts`, `client/src/constants.ts`, or co-located when local to one
  module). This covers: image dimensions (`IMG_WIDTH = 1080`), `per_page` default + clamp,
  request timeout, the IntersectionObserver `rootMargin`, the double-tap window, breakpoints,
  preload look-ahead count, and component sizes (heart icon px, burst size, etc.). Trivial
  literals stay inline where a const would only add noise — `0`/`1`, a loop index, `opacity`
  `0 → 1`. The test: would naming it make the code clearer or just longer?
- **Design tokens come from one place.** Colors, the gradient, animation timings, and the
  responsive sizes live in `tailwind.config.ts` (theme + keyframes) and `client/constants.ts`,
  not hardcoded across components.
- **Names say what they are.** No `temp`, `data2`, `rawValue`. A name describes the purpose.
- **Small, focused files; no single-use abstraction.** Don't build a generic layer before
  there's a second caller. Keep it readable over clever.

## Phases

Each phase leaves the app runnable and ends with one commit. Core is 0–8; 9 is the stretch
work and 10 is docs.

| #   | Outcome                                                                                                     | Commit                                                                          |
| --- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 0   | Monorepo scaffold: layered Express+TS (env validation) + Vite/React/TS/Tailwind/Query, dev proxy, both boot | `chore: scaffold layered express server and vite client with dev proxy`         |
| 1   | Unsplash proxy → normalized `Photo` DTO + page-based pagination (no `liked` yet); key server-side           | `feat(server): proxy unsplash photos and normalize to photo dto`                |
| 2   | SQLite likes: schema, repo, PUT/DELETE endpoints, merge `liked` into the feed                               | `feat(server): sqlite likes persistence and liked-flag merge into feed`         |
| 3   | Typed errors end-to-end (error middleware + 429 rate-limit mapping)                                         | `feat(server): typed error handling with unsplash rate-limit mapping`           |
| 4   | Client: full-bleed snap feed on the real first page (snap, arrow keys, gradient, heart)                     | `feat(client): full-bleed snap-scroll feed with like control`                   |
| 5   | Infinite pagination via `useInfiniteQuery` + IO sentinel (append-only)                                      | `feat(client): infinite feed via useInfiniteQuery and intersection sentinel`    |
| 6   | blur_hash placeholders + shimmer first-load + empty + error(+Retry) + responsive column/backdrop            | `feat(client): blurhash placeholders, skeleton, error/empty, responsive layout` |
| 7   | Like wired: optimistic flip + rollback; persists on refresh & restart                                       | `feat(client): optimistic like toggle with rollback and persistence`            |
| 8   | A11y pass (real button, aria, alt, keyboard, reduced-motion)                                                | `feat(client): keyboard navigation and accessibility for feed and likes`        |
| 9   | Stretch: next-image preloading + double-tap heart-burst                                                     | `feat(client): next-image preloading and double-tap heart-burst (stretch)`      |
| 10  | README + AI_WORKFLOW + final QA pass                                                                        | `docs: readme, ai-workflow, and final qa pass`                                  |

Per-phase tasks and how I verify each one are tracked in [PROGRESS.md](./PROGRESS.md).

## Known issues / out of scope

- Unsplash demo tier is 50 requests/hour — heavy dev scrolling can hit it (handled as a 429
  state). Noted in the README.
- No virtualization — a very long session accumulates DOM nodes. A documented next step.
- Likes are global with no count (no auth).
- No photographer credit overlay — a deliberate scope call.
