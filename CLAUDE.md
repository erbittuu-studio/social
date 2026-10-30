# CLAUDE.md: social

Facebook promotion posts for the studio: texts, images, the posting script and its GitHub Action. Read `README.md` for the files and `PLAN.md` for the plan. The other repos are in `../README.md`.

## Never do (the owner set these)
- Never post for real or run `--send` for the owner. Show the dry run and wait for the owner's yes.
- Never put a key, token or app secret in this repo, in a log or in chat. Keys live only in GitHub secrets.
- Never `git push`, never force-push, unless the owner says so in that message. Commit locally.
- Never use the permanent "Delete posts" tools on a Page; use trash or archive.
- Never touch a folder outside `PES_Apps`. Never open `../secrets`.

## How to work
- Say what you will change before changing it. Run `node post.mjs` (dry run) before committing.
- Plain human text: no em dashes, no price words, no trademarks, and every claim checked against the app's listing in `../faststore/data/apps/<id>/`.
- Branches: work on `release/YYYY-MM`; `main` is the shipped state and is what the schedule runs from.
- No comments in code and no dead code.
