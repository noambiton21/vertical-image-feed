# Progress

Live status for the phases in [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md), with the
tasks and the checks I run for each. Updated as each phase lands.
Status: ✅ Done · 🟡 In Progress · ⬜ Not Started.

| #   | Phase                       | Status                     | Commit |
| --- | --------------------------- | -------------------------- | ------ |
| 0   | Scaffold                    | 🟡 Built — awaiting commit | —      |
| 1   | Unsplash proxy + pagination | ⬜ Not Started             | —      |
| 2   | SQLite likes                | ⬜ Not Started             | —      |
| 3   | Typed errors                | ⬜ Not Started             | —      |
| 4   | Static snap feed            | ⬜ Not Started             | —      |
| 5   | Infinite pagination         | ⬜ Not Started             | —      |
| 6   | States + polish             | ⬜ Not Started             | —      |
| 7   | Likes wired                 | ⬜ Not Started             | —      |
| 8   | Accessibility               | ⬜ Not Started             | —      |
| 9   | Stretch                     | ⬜ Not Started             | —      |
| 10  | Docs + QA                   | ⬜ Not Started             | —      |

---

## Phase 0 — Scaffold

**Tasks:** root scripts (`dev`/`build`/`install:all`); layered Express+TS skeleton with env
validation, `app.ts` wiring, and `/api/health`; the server loads the root `.env` via Node's
`--env-file`; Vite + React + TS client with Tailwind (tokens + the four keyframes) and a
TanStack Query provider; Vite proxy `/api` → the server (target port read from `.env`);
`.env.example`, `.gitignore`, Prettier.

**Verify:** `npm run dev` boots both; `:5173/api/health` → `200 {ok:true}` through the proxy;
changing `PORT` in `.env` moves the server and the proxy follows it; `.env` gitignored,
`.env.example` committed.

**Commit:** `chore: scaffold layered express server and vite client with dev proxy`

- **Status:** 🟡 Built — awaiting commit · **Hash:** —
- **Verified:** `npm run install:all` clean (0 vulns); both `tsc` builds clean; `npm run dev`
  boots the server (port from `.env`) + client `:5173`; `:5173/api/health` → `{"ok":true}`
  through the proxy; set `PORT=3002` and confirmed the server moved and the proxy followed;
  `.env` confirmed gitignored; Prettier clean across the repo.

---

## Phase 1 — Unsplash proxy + pagination

**Tasks:** `unsplash.service` (fetch with Client-ID + timeout, normalize to `Photo`, guard
the shape); `photos.service` returns the page; `GET /api/photos` validates params (clamp
`per_page` 1–30) and returns `{ page, perPage, items }`.

**Verify:** `curl '/api/photos?page=1&per_page=5'` → 5 photos with the DTO fields only; bad
params → 400; the key never appears in the response.

**Commit:** `feat(server): proxy unsplash photos and normalize to photo dto`

- **Status:** ⬜ Not Started

---

## Phase 2 — SQLite likes

**Tasks:** `db/connection.ts` (schema on boot); `likes.repo` (`like`/`unlike`/`getLikedSet`);
`PUT`/`DELETE /api/photos/:id/like`; merge `liked` into the feed in `photos.service`.

**Verify:** `PUT` an id → liked in the next feed fetch; `DELETE` → not liked; restart the
server → state persists.

**Commit:** `feat(server): sqlite likes persistence and liked-flag merge into feed`

- **Status:** ⬜ Not Started

---

## Phase 3 — Typed errors

**Tasks:** `AppError` + subclasses; terminal error middleware that maps them to
`{ error: { code, message } }` with a status; 404 for unknown routes; map Unsplash 403/429 →
429, other upstream failures → 502.

**Verify:** bad/empty key → 502; forced rate limit → 429; bad params → 400; no stack traces.

**Commit:** `feat(server): typed error handling with unsplash rate-limit mapping`

- **Status:** ⬜ Not Started

---

## Phase 4 — Static snap feed

**Tasks:** `lib/api.ts`, `types/photo.ts`, `api/photos.api.ts`; scroll container (snap,
hidden scrollbar) + `PhotoSlide` (full-bleed, `100dvh`, gradient); `LikeButton` (visual) +
arrow-key nav; render the real first page.

**Verify:** 390px — one photo fills the screen, snaps cleanly; arrow keys move one slide; no
scrollbar.

**Commit:** `feat(client): full-bleed snap-scroll feed with like control`

- **Status:** ⬜ Not Started

---

## Phase 5 — Infinite pagination

**Tasks:** `usePhotosFeed` (`useInfiniteQuery` + cursor); `useIntersection` sentinel rooted
on the scroll container; append-only render; duplicate-fetch guard; `EndOfFeed` on a short
page.

**Verify:** next page loaded before the end; no scroll jump on append; no duplicate fetches.

**Commit:** `feat(client): infinite feed via useInfiniteQuery and intersection sentinel`

- **Status:** ⬜ Not Started

---

## Phase 6 — States + polish

**Tasks:** `BlurHashImage` (placeholder → fade-in); `FeedSkeleton`, `EmptyState`,
`ErrorState` (branches on code) + Retry; responsive column + blurred backdrop, desktop like
outside the column.

**Verify:** throttle → placeholder then sharp image, no white flash; server off → error +
Retry recovers; empty result → empty state; resize 768/1280 → column + backdrop.

**Commit:** `feat(client): blurhash placeholders, skeleton, error/empty, responsive layout`

- **Status:** ⬜ Not Started

---

## Phase 7 — Likes wired

**Tasks:** `useToggleLike` (optimistic `flipLikedInPages`, rollback on error, no
invalidate-on-settle); heart fills coral + `heartPop` on tap.

**Verify:** tap → instant fill; refresh → still liked; restart server → still liked; kill
server mid-toggle → rollback + error surfaced.

**Commit:** `feat(client): optimistic like toggle with rollback and persistence`

- **Status:** ⬜ Not Started

---

## Phase 8 — Accessibility

**Tasks:** like button `aria-label` + `aria-pressed`, real `<button>`; image `alt`,
decorative layers `aria-hidden`; `prefers-reduced-motion` suppresses animations.

**Verify:** keyboard toggles the like; reduced motion suppresses animation but state still
changes.

**Commit:** `feat(client): keyboard navigation and accessibility for feed and likes`

- **Status:** ⬜ Not Started

---

## Phase 9 — Stretch

**Tasks:** `usePreloadNext` (preload next 1–2 on index change); `useDoubleTap` + `HeartBurst`
(idempotent double-tap like with the burst).

**Verify:** fast scroll shows no blank frames; double-tap likes with a burst and never unlikes.

**Commit:** `feat(client): next-image preloading and double-tap heart-burst (stretch)`

- **Status:** ⬜ Not Started

---

## Phase 10 — Docs + QA

**Tasks:** README (setup/run, Unsplash + key, what's next, known issues); AI_WORKFLOW; final
QA on a narrow viewport; confirm no secrets / `*.db` in git; fresh-clone boot works.

**Verify:** fresh clone + documented steps boots both apps; all QA items pass.

**Commit:** `docs: readme, ai-workflow, and final qa pass`

- **Status:** ⬜ Not Started
