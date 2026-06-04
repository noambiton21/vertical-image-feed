# AI Workflow

How I used AI tools on this project, what I let them do, and where I stepped in.

## Tools

- **Claude Code** — the main driver. Used it for scaffolding, the phased build, debugging, and
  reviewing my own diffs before each commit.
- **Claude (chat) + the Claude design tool** — to iterate the UI mock down to exactly the PRD
  (one photo + a heart + loading/empty/error). I pared the mock down myself rather than take the
  fuller social layout it first produced.

I worked in phases (see [PROGRESS.md](./PROGRESS.md)). Each phase: plan, build, verify, commit.
Keeping the steps small made the AI easier to steer and easier to catch.

## Representative prompts

These are the actual prompts, typos and all.

**1. Kicking off — assignment + stack → plan and progress file.**

I used Claude chat to generate a strong prompt for Claude Code to create the project plan, then
fed that prompt in with `@docs/ASSIGNMENT.md` to produce an implementation plan and a progress
file. I didn't take the result as-is: I reworked the plan and picked the stack myself (React + Vite
+ TypeScript on the client, Node + Express + TypeScript + SQLite on the server), because some of
what it proposed was over-engineered for the scope. That reworked, phased plan + progress file is
what drove the whole build.

**2. Senior-dev review of my own client code.**
> "take a look at @docs/ASSIGNMENT.md, @docs/IMPLEMENTATION_PLAN.md and @docs/PROGRESS.md
> i want you to review the client code like a senior developer doing a real PR review check if
> the implementation actually matches the assignment requirements and the plan
> if you can improved or simplified"

I used it as a reviewer, not just a writer — feeding it the assignment + plan + progress so the
review was grounded in what the project was actually supposed to be.

**3. Tuning the infinite-scroll prefetch.**
> "the next page only starts loading 1 slide before the end, it feels a bit late when i scroll
> fast.. can we make it start loading 3 images before the end instead?"

The first cut fetched the next page one slide early, which felt late on a fast scroll. Bumped the
lookahead to three viewports.

**4. Debugging the error state — a real back-and-forth.**
> "i blocked the requests from the network tab in dev tools to test the error state but it takes
> a few seconds until the error page shows up. why does that happen?"

I was QA-ing the error state by blocking the network and noticed a delay. We dug into it together
until I narrowed down what I was actually blocking.

## Where the AI got it wrong (and how I caught it)

**The preload that did nothing.** For the stretch "smart preloading" I asked it to warm the next
couple of images. It wrote a preload hook and reported it done. But when I actually loaded the page
I saw every image fetching at once:

> "when im rendering the page i can see all the images loading at once in the network tab, its looks like
> the preload not really doing anything"

I sent it a screenshot of the Network tab. The cause: every slide mounts at once in one scroll
container, so the browser was eagerly fetching *all* mounted `<img>`s — which made the preload hook
completely redundant. The fix wasn't the hook at all; it was adding `loading="lazy"` to the slide
image so off-screen slides defer, *then* the 2-ahead warm actually buys something. I only caught
this because I checked the real Network tab instead of trusting "done."

**Wrong home for a fix.** While hardening the error handling we tracked down why the error card
took ~7s to appear: the `QueryClient` had no config, so TanStack Query's default 3-retry
exponential backoff (~1s + 2s + 4s) ran before the error surfaced — and a real 429 rate-limit (my
likely failure) would get pointlessly retried 3 times too. The fix was right (a `retry` policy that
doesn't retry 4xx), but it dropped the config straight into `main.tsx`. That felt off to me:

> "i dont think main.tsx is the right place for the retry config..
> can we move it somewhere in lib next to the api stuff?"

`main.tsx` should be a thin composition root — mount React, wire the provider — not where retry
*policy* lives. I pushed back, and it moved the `QueryClient` into a configured singleton in `lib/`
(next to `api.ts` / `queryKeys.ts`, beside the `ApiError` the policy branches on), leaving
`main.tsx` to just import and pass it. The behavior was the AI's; the call on *where it belongs* was
mine.

## Where I chose *not* to use AI

- **Choosing the image API.** I read the assignment's API options and went through Unsplash's own
  documentation myself before deciding. I picked Unsplash because of its clean pagination, the
  `blur_hash` it returns (which I use for the no-flash placeholders), and its solid docs.
- **Architecture decisions.** I used AI to explore options, but I made the final calls on data
  flow, folder structure, API boundaries, and where responsibilities belong. For example, when the
  retry policy ended up in `main.tsx`, I moved it into a dedicated `QueryClient` setup because I
  wanted `main.tsx` to stay a thin entry point.
- **Debugging production behavior.** When something behaved unexpectedly, I didn't ask the AI to
  blindly fix it. I reproduced the issue, used DevTools, inspected network requests, and formed my
  own hypothesis first. The preload issue is a good example: the AI considered the task complete,
  but checking the Network tab showed every image was still loading immediately.
- **Verification and edge cases.** I did not rely on AI to tell me whether a feature worked. I
  manually tested pagination, persistence, loading states, error states, and API responses. Any
  behavior described in the README was verified by me before it was documented.
- **Driving the plan and the pace.** I read the plan and made changes inside it myself, and only
  once I had a final version I was happy with did I approve it. From there I had it run phase by
  phase — I reviewed every phase's changes, and only after I approved (or gave feedback to change
  things) did that phase get committed. The AI never ran ahead on its own.

## How I verified AI-generated code

- **Builds on every phase.** Every phase had to pass `npm run build` before I considered it
  complete (`tsc` on the server, `tsc -b` / `vite build` on the client). I also kept formatting
  clean and avoided introducing any `any` into the codebase.
- **Manual testing in the browser.** I didn't rely on the AI telling me a feature was done. I
  manually tested the feed, infinite scrolling, loading states, error states, and like persistence.
  For example, I verified that likes survived a page refresh and a server restart.
- **API verification.** I called the backend endpoints directly by curl to verify the actual API contract
  and error handling. I checked success responses as well as invalid parameters, upstream failures,
  and rate-limit scenarios to make sure the client behaved correctly.
- **DevTools and Network inspection.** I regularly used the browser's DevTools and Network tab to
  validate behavior. The preload implementation is a good example: the AI considered the task
  complete, but the Network tab showed all images were still loading immediately, which led me to
  the real fix.
- **Reviewing every generated change.** I read every AI-generated diff before committing it. If I
  didn't understand a change, it didn't get committed. I also kept track of anything I hadn't fully
  verified yet in PROGRESS.md rather than assuming it worked.
