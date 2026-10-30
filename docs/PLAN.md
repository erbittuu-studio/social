# Promotion plan

Status: launched. Day 1 of each Page is live, days 2 and 3 are scheduled. The daily Action continues from day 4; start it after the scheduled days have gone out.

## Where the data lives

One folder per Page, one folder per month, one `posts.json` in each (see `README.md`). A post is `draft` until the owner approves it; only `ready` posts can be sent.

## Goal

More downloads of the four apps, by regular posts that each carry a picture, the App Store link, the website link and hashtags. Every number is read from App Store Connect through faststore, not guessed.

## Two Pages, two audiences

| Page | Audience | Apps | Voice |
|---|---|---|---|
| Erbittuu Kids: Draw, Color, Learn | Parents of young children, and people who like to draw | Colorful, ABC Learning, Drawing Pad | Warm, short, written for parents. No ads, no accounts, no chat |
| Prarthana: Daily Hindu Prayers | Adults who pray every day | Prarthana | Calm and respectful. Hindi, English and Gujarati |

The two audiences are kept apart on purpose, so no follower gets posts that mean nothing to them.

## Launch posts (3 per Page)

- Kids: 1. New on the App Store: Colorful. 2. Drawing Pad idea prompt, "a cat on the moon". 3. ABC Learning, the picture cards that talk.
- Prarthana: 1. Download Prarthana, with what is in it. 2. Hanuman Chalisa in three languages. 3. The meaning of every verse.

## Weekly rhythm after the launch

- One post a day for 30 days, from the month files in `pages/<page>/<YYYY-MM>/posts.json`.
- Kids Page rotates Drawing Pad, Colorful, ABC Learning. Prarthana Page rotates texts, meanings, festivals, the jaap mala and the Watch.
- A short "thought" post on the Prarthana Page now and then, from the daily thought in the app.

## Moments to plan around (from the in-app events in faststore)

- Prarthana: Diwali, Tulasi Vivah, Gita Jayanti.
- Kids: Children's Day, winter weather, holiday cards.

Post one reminder before each moment and one on the day. Dates are in `../../faststore/data/apps/<id>/events.json`; do not retype them here.

## Measuring

- Link each post to the matching custom product page (for example `diwali-2026`, `hanuman-chalisa`, `alphabet-cards`, `tap-to-fill`), so App Store Connect shows which post drove a download. The ids are in `../../faststore/data/apps/<id>/store-links.json`. Put the page's id in the post's `ppid` field; the script adds it to the App Store link.
- Read the numbers weekly with `./fs aso-track` in faststore. Keep the posts that bring downloads, change the ones that do not.

## Free actions beside the posts

- Pin the launch post on each Page.
- Put the App Store link on each Page's button and in the Links section (done).
- Answer every comment within a day.
- Share the Prarthana posts in the Hindu prayer groups the owner already belongs to, with the group's rules in mind.

## Needs the owner

1. Posting time and time zone (the workflow is set to 09:00 India time and can be changed).
2. Create the GitHub repo and push (the owner types the push).
3. Add the secret `FB_PAGES_TOKEN`, then run the workflow once with `check`. A public repo avoids the billing limit on private repos.
4. Make a new key and remove the old ones, since earlier keys were pasted in a chat.
