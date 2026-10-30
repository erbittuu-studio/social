# CLAUDE.md: social

Facebook promotion for the studio: post texts, pictures, the schedule, the posting script and its GitHub Action. Read `INDEX.md` to find a file, `README.md` for the commands and `docs/PLAN.md` for the plan. The other repos are in `../README.md`.

## Never do (the owner set these)
- Never run `--send` or post for real for the owner. Show the dry run and wait for the owner's yes.
- Never put a key, token or app secret in this repo, in a log, in a command you show, or in chat. The key lives only in the GitHub secret `FB_PAGES_TOKEN` and in the owner's `secrets` folder.
- Never open `../secrets`. Never touch a folder outside `PES_Apps`.
- Never `git push`, never force-push, unless the owner says so in that message. Commit locally.
- Never use a permanent "Delete" on a Page or a post, in the browser or in the API. Use trash or archive.
- Never set a post to `ready` yourself. Only the owner approves a post.

## Where things are
| What | Where |
|---|---|
| The posts, one file per Page and month | `pages/<kids or prarthana>/<YYYY-MM>/posts.json` |
| The Pages (name, id, address) | `config/pages.json` |
| The apps (name, three hashtags), event hashtags | `config/apps.json`, `config/events.json` |
| The plan (dates, slots, weekday languages) | `config/plan.json` |
| The words, per app and picture | `content/<store id>.json`, `content/1597899453-morning.json` |
| Pictures: icons, headers, festival pictures, store pictures | `images/icons`, `images/headers`, `images/greetings`, `images/screens` |
| Store pictures, event pictures, listings, event dates | `../faststore/data/` (read only from here) |
| Scripts: schedule, plan, pictures | `scripts/post.mjs`, `scripts/plan.mjs`, `scripts/make-greetings.mjs`, `scripts/make-screens.mjs` |
| Plan, hashtags, events, checks | `docs/PLAN.md`, `docs/HASHTAGS.md`, `docs/EVENTS.md`, `docs/VERIFY.md` |
| The weekly run | `.github/workflows/post.yml` |

A fact is written in one place. Page names and ids are only in `config/pages.json`; hashtags only in `config/apps.json`; event dates only in faststore's `events.json`.

## Before a post is ready
Every post stays `draft` until all of this is true:
1. Each claim is checked against the app's listing in `../faststore/data/apps/<id>/`.
2. The picture exists, is English (or the language of the post) and matches the text.
3. Event days: the date is checked against a proper calendar, and the picture is that event's.
4. Hindi and Gujarati texts are checked by a native reader.
5. The App Store link, the website link and any `ppid` open correctly.
6. The owner has seen it and said yes.

## How to work
- Say what you will change before changing it. Run `node scripts/post.mjs` (the dry run) before committing.
- Work on `release/YYYY-MM`. `main` is the shipped state and the branch the schedule runs from.
- Change the words in `content/`, then run `node scripts/plan.mjs`. Do not edit a draft in `pages/` by hand; the planner rebuilds drafts. A post that is `ready` or later is never rebuilt.
- One file per Page and month. Do not move a post between months after it is `scheduled`.
- Keep `INDEX.md` true: add or remove a line in the same commit as the file.
- Plain human text: no em dashes, no price words ("free"), no trademarks, no template phrases. At most three hashtags: the app's name, then two topic tags. A festival day may replace the third with `tags`.
- Kids Page: write for parents. Drawing Pad is not a children's app, so its posts speak to parents and drawing fans.
- English first. Hindi and Gujarati posts stay `draft` until a native reader has checked them.
- Pictures: English store pictures only, phone-shaped. Event pictures only on event days. A picture is used at most three times in the plan.
- No comments in code and no dead code.

## Before every commit
- `node scripts/plan.mjs` runs without error and `docs/VERIFY.md` is still true.
- `node --check scripts/post.mjs` and `node scripts/post.mjs` run without error.
- Every `posts.json` is valid JSON, ids are unique, and the folder of each file matches `config/pages.json`.
- `INDEX.md` lists what is on disk.
