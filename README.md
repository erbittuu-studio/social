# social

Posts the studio's Facebook promotion posts through the Graph API, from a GitHub Action. It is the only place that holds the post texts, the post images and the posting script.

| File | What it is |
|---|---|
| `post.mjs` | Posts the next unposted entry for each Page. Dry run unless `--send`; `--check` tests each key |
| `pages.json` | The two Pages: name, Page id, address, the secret that holds its key, its post file |
| `apps.json` | The four apps: name and hashtags |
| `posts-kids.json`, `posts-prarthana.json` | The posts in order, one per day. `app` is the store id; the App Store link, the website link and the hashtags are added by the script |
| `images/<store id>.png` | The App Store header of each app, sent with every post of that app |
| `state.json` | Which days are posted. Written by the Action |
| `.github/workflows/post.yml` | Runs every day, and by hand with `dry`, `check` or `send` |
| `PLAN.md` | The promotion plan |

## Keys

Each Page has its own key, stored as a GitHub secret and never in this repo: `PAGE_TOKEN_KIDS` and `PAGE_TOKEN_PRARTHANA`. The Meta app is PES Social Poster. Run the workflow once with `check` first: it says whether each key can post.

## Use

- `node post.mjs` shows what would be posted.
- `PAGE_TOKEN_KIDS=... node post.mjs --check` tests a key.
- `node post.mjs --send --page kids` posts for one Page.

The daily schedule runs only from the default branch.
