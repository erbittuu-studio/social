# Index

Every file and folder in this repo, one line each. If you add or remove one, change this file in the same commit.

## Top level

| Path | What it is |
|---|---|
| `README.md` | What this repo is, the two Pages, the commands |
| `INDEX.md` | This list |
| `CLAUDE.md` | The rules for anyone working here, including Claude |

## config/ (facts that do not change often)

| Path | What it is |
|---|---|
| `config/pages.json` | The two Pages: name, Page id, address, which folder holds their posts |
| `config/apps.json` | The four apps: name and three hashtags each |
| `config/events.json` | The hashtag that replaces the third one on an event day |
| `config/plan.json` | The plan: start date, number of days, posting slots and the language of each weekday |

## content/ (the words, one file per app)

| Path | What it is |
|---|---|
| `content/<store id>.json` | For each picture, up to three texts (one per use), and for event pictures the days they are posted |
| `content/1597899453-morning.json` | The text-only morning posts of the Prarthana Page, by language, and the event mornings |

## pages/ (the posts: one folder per Page, one per month)

| Path | What it is |
|---|---|
| `pages/README.md` | How a month file is built and named |
| `pages/kids/<YYYY-MM>/posts.json` | Posts for the kids Page in that month |
| `pages/prarthana/<YYYY-MM>/posts.json` | Posts for the Prarthana Page in that month |

Months: `2026-10` (day 1 posted), `2026-11`, `2026-12` and `2027-01` for both Pages. Drafts run from 3 November 2026: kids to 13 January 2027, Prarthana to 31 January 2027.

## images/ (every picture a post can use)

| Path | What it is |
|---|---|
| `images/icons/<store id>.png` | The four app icons, 1024 pixels, used inside greeting pictures |
| `images/headers/<store id>.png` | The App Store header of each app |
| `images/greetings/<event>.jpg` | Festival and event pictures: diwali, tulasi-vivah, gita-jayanti, makar-sankranti, childrens-day, new-year |
| `images/screens/<store id>/<name>-<nn>.jpg` | The App Store and custom page pictures, 1080 wide: `store-nn` general, `<page>-nn` per custom page, `store-hi-nn` and `store-gu-nn` Hindi and Gujarati |

Store ids: Drawing Pad 1547752865, Colorful 1597789030, ABC Learning 1597421237, Prarthana 1597899453.

## scripts/ (code)

| Path | What it is |
|---|---|
| `scripts/post.mjs` | Reads the month files and schedules the `ready` posts on Facebook |
| `scripts/make-greetings.mjs` | Draws the six greeting pictures from the app icons |
| `scripts/make-screens.mjs` | Converts the store and custom page pictures of `../faststore` into `images/screens` |
| `scripts/plan.mjs` | Builds the draft posts of both Pages from `content/` and `config/plan.json` |

## docs/ (decisions and plans)

| Path | What it is |
|---|---|
| `docs/PLAN.md` | The promotion plan: audiences, rhythm, measuring |
| `docs/HASHTAGS.md` | The hashtag and tagline research and the decisions |
| `docs/EVENTS.md` | The festivals and events, which picture each one uses, and what is missing |
| `docs/VERIFY.md` | What has been checked, what is open, and the festival dates found |

## Automation

| Path | What it is |
|---|---|
| `.github/workflows/post.yml` | Weekly run, and a manual button with `dry`, `check` or `send` |
