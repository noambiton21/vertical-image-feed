# Take-Home Assignment: Vertical Image Feed ("TikTok for photos")

**Role:** Full-Stack Engineer.
**What we're evaluating:** product sense, full-stack execution, and — explicitly — how effectively you collaborate with AI coding tools.

## 1. The use case (this is the whole assignment)

Build a full-screen, vertically-scrolling image feed — the photo equivalent of a TikTok / Reels feed.

A user opens the app and sees one image at a time, filling the viewport. They scroll (or swipe / arrow-key) and the feed snaps to the next image. Images are pulled from a third-party image API, and the feed loads more as the user approaches the end (infinite feed). Each image has a single lightweight interaction: a Like that persists.

That's it. One screen, one flow. Do that one thing well rather than building five half-finished things. We are deliberately keeping the scope narrow so you can show depth.

## 2. Core requirements (must-have)

- **Snap-scrolling vertical feed** — one image per "page," fills the viewport, snaps cleanly on scroll. Must feel smooth on a phone-sized viewport.
- **Real image data from an external API** — see options in §5. No hardcoded image list.
- **Infinite loading / pagination** — fetch the next batch before the user hits the bottom; no visible "end of feed" jank.
- **Like interaction with persistence** — tapping Like is reflected immediately and survives a page refresh (your choice how: backend store, or a documented client-side fallback — but be deliberate about it).
- **Graceful states** — loading, empty, and error (e.g. API down or rate-limited) are all handled visibly.
- **A backend layer you own** — even if thin. At minimum, proxy the third-party API through your own server so the API key isn't exposed to the client, and serve the like state. (A serverless function or a small API route counts.)

## 3. Stretch goals (optional — pick at most one or two, only if core is solid)

- Smart preloading of the next image(s) so scrolling never shows a blank frame.
- Double-tap to like with a small animation.
- A "saved / liked" view.
- Basic virtualization so a long session doesn't accumulate hundreds of DOM nodes.
- Lightweight tests for the feed/pagination logic.

A polished core beats a buggy core surrounded by stretch goals. We will not reward breadth at the expense of the main flow.

## 4. The AI-tooling showcase (required — read carefully)

We expect you to use Claude Code and/or other AI tools throughout, and we want to see how you used them. This is a primary evaluation axis, not an afterthought.

Include in your repo a short **AI_WORKFLOW.md** (1–2 pages, no more) covering:

- Which tools you used and for what (e.g. Claude Code for scaffolding the feed component, X for debugging the snap behavior, etc.).
- 3–5 representative prompts that did real work — the actual prompts, not cleaned-up versions. Include at least one where the AI got it wrong and how you noticed and corrected it.
- Where you chose NOT to use AI and why (the judgment calls matter as much as the wins).
- How you verified AI-generated code — what you reviewed, what you tested, what you rewrote.

We are not looking for "the AI wrote everything." We are looking for an engineer who drives the tools, catches their mistakes, and stays accountable for the result. Over-reliance you can't explain will read as a red flag; thoughtful, verified delegation will read as a strength.

If you used Claude Code, committing a `.claude/` session or pasting a session transcript link is a nice bonus but not required.

## 5. Image API options

Use any of these. Center on the first if you want a default; the others are listed because they're stable and low-friction so you don't lose half a day to auth.

- **Imgur API (v3)** — `https://api.imgur.com/3/...`, auth via a Client-ID header. Free; requires registering an app for a client ID. Good "gallery" endpoints to build a feed from. (Note: register the app under your own account; treat the client ID as a secret on your server.)
- **Unsplash API** — excellent docs, free demo tier, high-quality photos, clean pagination. Great default if Imgur registration is slow.
- **Pexels API** — free, generous limits, simple auth.
- **Lorem Picsum** (https://picsum.photos) — zero auth, supports a `?page=&limit=` list endpoint. Perfectly acceptable if you'd rather spend your time on the feed than on API keys.

Pick based on where you want to spend your time. We care that you integrate a real paginated API and handle its quirks (rate limits, inconsistent fields, missing images) — not which one you picked.

## 6. Tech constraints

- **Frontend framework:** your choice (React/Next).
- **Backend:** your choice, but there must be one (see core requirement #6). A Next.js, small Express/Fastify server.
- **No secret keys in client code or git history.** Use env vars; include a `.env.example`.
- **Mobile-first.** We will primarily test in a narrow viewport.

## 7. Deliverables

- A git repo (GitHub/GitLab link, or a zip) with clear commit history.
- A **README.md** with: setup/run steps, which image API you used and how to get a key, what you'd do next with more time, and any known issues.
- The **AI_WORKFLOW.md** from §4.

## 8. How we'll evaluate

| Area                | What good looks like                                                                   |
| ------------------- | -------------------------------------------------------------------------------------- |
| Core flow quality   | Snap scrolling feels native; infinite load is seamless; like persists; states handled. |
| AI collaboration    | Clear, honest AI_WORKFLOW.md; evidence you drove the tools and caught their mistakes.  |
| Full-stack judgment | API key protected server-side; sensible data flow; thin but real backend.              |
| Code quality        | Readable, organized, not over-engineered for the scope.                                |
| Product sense       | Sensible defaults, error/empty handling, attention to feel.                            |
| Communication       | README and recording make it easy for us to run and understand.                        |

## 9. Scope & time guardrails

This is designed for one to two focused days. Please don't spend a week. If you run low on time, ship a smaller, working version and write down what you'd do next — we explicitly reward knowing where to stop. A working core flow with an honest README beats an ambitious half-broken submission.

## 10. Follow-up

In the follow-up conversation, we'll ask you to walk us through the code live and make a small change on the spot — including talking through how you'd prompt for it. Build something you understand well enough to extend in front of us.

Good luck — have fun with it.
