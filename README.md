# Vertical Photo Feed

A full-screen, vertically-scrolling, snap-to-photo feed — TikTok/Reels but for photos. One
image per viewport that snaps on scroll/swipe/arrow keys, infinite pagination, and a single
Like per photo that persists across refresh. Mobile first.

Built with React + Vite + TypeScript + Tailwind + TanStack Query on the client, and Node +
Express + TypeScript + SQLite on the server. Photos come from Unsplash, proxied through the
server so the API key stays off the client.

See [docs/IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md) for the design and the
phased build, and [AI_WORKFLOW.md](./AI_WORKFLOW.md) for how I used AI tools on it.

## Demo

<!--
  TODO: drop the screen recording here. Open this README on github.com, edit it, and drag the
  video file (.mp4 / .mov / .webm, under ~100 MB) onto this line — GitHub uploads it and replaces
  this comment with its own asset URL, which inline-plays in the rendered README. Show the feel:
  snap scroll, like, double-tap heart-burst, and an error/empty state.
-->

_Screen recording coming here — drag the video into this section on GitHub (see the comment above)._

## Stack

- **Client:** React + Vite + TypeScript + Tailwind CSS + TanStack Query
- **Server:** Node.js + Express + TypeScript, SQLite (better-sqlite3)
- **Images:** Unsplash API (key kept server-side)

## Getting an Unsplash key

1. Go to https://unsplash.com/oauth/applications and register an app (free demo tier).
2. Copy the app's **Access Key**.
3. Paste it into `.env` (next section) as `UNSPLASH_ACCESS_KEY`. It stays on the server and is
   never sent to the client.

> The demo tier allows **50 requests/hour**. That's plenty for normal use; heavy scrolling
> during development can hit it, in which case the feed shows a rate-limit state.

## Setup & run

Requires Node 18+ (developed on Node 22).

```bash
# install root + server + client deps
npm run install:all

# create your env file and paste in your Unsplash Access Key
cp .env.example .env

# start both apps (client :5173, server :3001; Vite proxies /api → server)
npm run dev
```

- App: http://localhost:5173

## How it works

- The server proxies Unsplash and **normalizes** each photo to just what the UI needs
  (`id`, `url`, `width`, `height`, `blurHash`, `liked`) — the client never sees a raw Unsplash
  object or the key.
- **Likes** are stored in SQLite and merged into the feed server-side, so a refresh restores
  them with no extra request. They're global and anonymous (no auth) and shown as
  filled/outlined with no count.
- **Infinite scroll** uses CSS snap + an IntersectionObserver sentinel that fetches the next
  page ~a viewport early, appending only (so the scroll position never jumps).
- **No white flash:** each photo shows its Unsplash `blur_hash` as an instant placeholder and
  fades in the real image on load.

## Decisions worth calling out

- **Minimal UI — no photographer credit.** The design is just the photo and a Like. Unsplash's
  guidelines ask apps to credit the photographer; I deliberately keep the overlay clean for
  this single-screen demo. In a real product I'd add the credit (and Unsplash's
  download-tracking) back.

## What I'd do next with more time

- Add the photographer credit + Unsplash download tracking to be guidelines-compliant.
- Virtualize the feed so a very long session doesn't accumulate DOM nodes.
- Cache feed pages on the server to ease the demo-tier rate limit.

## Known issues

- Unsplash demo tier is 50 requests/hour; heavy dev scrolling can hit it (shown as a
  rate-limit state).
- No virtualization yet — long sessions grow the DOM.
- Likes are global (no per-user state) and have no count.
