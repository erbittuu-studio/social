# social

The studio's Facebook promotion: what we post on the two Pages, with which picture, and when. It holds the post texts, the pictures, the schedule and the script that sends them. It never holds a key.

Start with `INDEX.md` to find any file. Rules for working here are in `CLAUDE.md`. The plan is `docs/PLAN.md`.

## The two Pages

| Folder | Page | Promotes | Posts a day (plan) |
|---|---|---|---|
| `pages/kids/` | Erbittuu Kids: Draw, Color, Learn | Colorful, ABC Learning, Drawing Pad | 3, one per app |
| `pages/prarthana/` | Prarthana: Daily Hindu Prayers | Prarthana | 2, morning and evening |

## How a post gets out

1. The words are written in `content/`, and `scripts/plan.mjs` places them into the Page's month files as `draft`. It rebuilds only drafts; posts that are `ready`, `scheduled` or `posted` stay as they are.
2. It is checked (see `CLAUDE.md`, "Before a post is ready") and the owner approves it: `ready`.
3. `scripts/post.mjs --send` hands it to Facebook with its time: `scheduled`. Facebook publishes it: `posted`.

The GitHub Action in `.github/workflows/post.yml` runs step 3 every week for the next 14 days.

## Commands

| To | Run |
|---|---|
| See what would be scheduled (no key needed) | `node scripts/post.mjs` |
| Schedule the next 14 days | `FB_PAGES_TOKEN=... node scripts/post.mjs --send --days 14` |
| Test the key on both Pages | `FB_PAGES_TOKEN=... node scripts/post.mjs --check` |
| One Page only | add `--page kids` or `--page prarthana` |
| Rebuild all draft posts from the words | `node scripts/plan.mjs` |
| Remake the festival pictures | `node scripts/make-greetings.mjs` (needs `../faststore/node_modules`) |
| Refresh the store pictures | `node scripts/make-screens.mjs` (needs `../faststore`) |

## The key

One key serves both Pages. It is the system-user key of the Meta app PES Social Poster (configuration PES Pages System). It lives only in the GitHub secret `FB_PAGES_TOKEN` and in the owner's `secrets` folder. If a key is ever shown in a chat, treat it as exposed and replace it.

## Publishing this repo

Not on GitHub yet. When it is: create the repo (public avoids the Actions billing limit on private repos), push `release/2026-11`, add the secret `FB_PAGES_TOKEN`, run the workflow once with `check`, then merge to `main`. The weekly schedule runs only from `main`.
