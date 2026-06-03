# Progress

Live status for the phases in [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md), with the
tasks and the checks I run for each. Updated as each phase lands.
Status: ✅ Done · 🟡 In Progress · ⬜ Not Started.

| #   | Phase                       | Status                     | Commit |
| --- | --------------------------- | -------------------------- | ------ |
| 0   | Scaffold                    | ✅ Done                    | ff514a8 |
| 1   | Unsplash proxy + pagination | ✅ Done                    | e62f889 |
| 2   | SQLite likes                | ✅ Done                    | _pending_ |
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
validation and `app.ts` wiring; the server loads the root `.env` via Node's `--env-file`;
Vite + React + TS client with Tailwind (tokens + the four keyframes) and a TanStack Query
provider; Vite proxy `/api` → the server (target port read from `.env`); `.env.example`,
`.gitignore`, Prettier.

**Verify:** `npm run dev` boots both; the client serves on `:5173` and proxies `/api` to the
server; changing `PORT` in `.env` moves the server and the proxy follows it; `.env` gitignored,
`.env.example` committed.

**Commit:** `chore: scaffold layered express server and vite client with dev proxy`

- **Status:** ✅ Done · **Hash:** `ff514a8`
- **Verified:** `npm run install:all` clean (0 vulns); both `tsc` builds clean; `npm run dev`
  boots the server (port from `.env`) + client `:5173`; set `PORT=3002` and confirmed the
  server moved and the proxy followed; `.env` confirmed gitignored; Prettier clean across the
  repo.

---

## Phase 1 — Unsplash proxy + pagination

**Tasks:** `unsplash.service` (fetch with Client-ID + timeout, normalize to `Photo`, trust
Unsplash's stable API and throw `AppError` on failure); `GET /api/photos` — the controller
parses + validates `page`/`per_page` (missing → defaults, present → `Number(...)`), then calls
the service and returns `{ page, perPage, items }`.

**Verify:** `curl '/api/photos?page=1&per_page=5'` → 5 photos with the DTO fields only;
missing params use defaults; invalid values (`page=abc`, `page=0`, `page=-5`, `page=2.7`,
`per_page=100`) → `400` (the controller rejects them rather than passing bad values to
Unsplash); bad/empty key → `502`; the key never appears in the response.

**Commit:** `feat(server): proxy unsplash photos and normalize to photo dto`

- **Status:** ✅ Done · **Hash:** `e62f889`
- **Verified (live against Unsplash with the real key):** `GET /api/photos?page=1&per_page=5`
  → 200 with 5 items; keys are exactly `id, url, width, height, blurHash` (no Unsplash extras);
  `url` is `urls.raw` + `&w=1080&fit=crop&q=80`. Missing params use defaults (page→1,
  perPage→8); invalid params → `400` with a generic message. Bad key → clean `502`, no stack
  trace. The Access Key never appears in the response body. Works through the Vite proxy at
  `:5173/api/photos`. `tsc` + Prettier clean.
- **Notes:** No new dependencies (Node `fetch` + `AbortSignal.timeout`). `liked` is **not** on
  the DTO yet — added in Phase 2. Error handling is intentionally lean: an
  `AppError(status, message)` class plus a terminal `errorHandler` middleware that returns
  `{ error: message }` for any `AppError`, `400` for malformed JSON, and a generic `500`
  otherwise. The controller throws `400` for bad params; `unsplash.service` throws `502` for
  any upstream failure (network, timeout, non-OK, bad body) after logging request context.
  A richer typed-error envelope (machine-readable `code`, distinct `429` rate-limit mapping,
  404 catch-all) is deferred to **Phase 3** if the client needs to branch on error type.

---

## Phase 2 — SQLite likes

**Tasks:** `db/connection.ts` (schema on boot); `likes.repo` (`like`/`unlike`/`getLikedSet`);
`PUT`/`DELETE /api/photos/:id/like`; merge `liked` into the feed in `photos.service`.

**Verify:** `PUT` an id → liked in the next feed fetch; `DELETE` → not liked; restart the
server → state persists.

**Commit:** `feat(server): sqlite likes persistence and liked-flag merge into feed`

- **Status:** ✅ Done · **Hash:** `_pending_`
- **Verified (live, fresh DB):** `db/connection.ts` opens better-sqlite3 (WAL) at
  `data/likes.db`, creating the dir and ensuring the schema on first import (boot). The feed DTO
  now carries `liked` — keys are exactly `id, url, width, height, blurHash, liked`.
  `PUT /api/photos/:id/like` → `{ id, liked: true }` and the same id comes back `liked: true`
  on the next `GET /api/photos`; `DELETE` → `{ id, liked: false }` and the id reads
  `liked: false` again. `PUT` is idempotent (repeated calls stay `liked: true`, no constraint
  error — `INSERT ... ON CONFLICT DO NOTHING`). Liked a fixed id, restarted the server, and the
  row survived (persists across restart). `tsc` + Prettier clean.
- **Notes:** Layering held — `likes.repo` is the only place SQL lives; `photos.service` does the
  merge (`liked = likedSet.has(id)`) so `unsplash.service` returns a `PhotoBase` and only the
  feed service stamps `liked`. `getLikedSet` short-circuits on an empty page and uses a single
  parameterized `IN (...)`. Likes routes live in `photos.routes.ts` under `/photos/:id/like`
  (the resource they belong to) rather than a separate router that would duplicate the `:id`
  path — `likes.routes.ts` from the plan tree was not needed. DB path is overridable via
  `DB_PATH`; `data/` and `*.db` are already gitignored, so no DB file enters git.

---

## Phase 3 — Typed errors

**Tasks:** build on the lean `AppError(status, message)` + terminal middleware from Phase 1 —
add a machine-readable `code` to the envelope (`{ error: { code, message } }`) if the client
needs to branch on error type; 404 for unknown routes; map Unsplash 403/429 → 429 (distinct
from other upstream failures → 502).

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
