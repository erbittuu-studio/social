# pages

One folder per Facebook Page, one folder per month inside it.

```
pages/kids/2026-11/posts.json
pages/prarthana/2026-11/posts.json
```

A month file is a list of posts. A post's `at` time decides which month file it belongs to, in UTC. Do not move a post to another month after it is `scheduled`.

The fields of a post, the four statuses, and the rules for moving a post to `ready` are in `../README.md` and `../CLAUDE.md`. The folder name must match the `folder` of that Page in `../config/pages.json`.

To add a month, make `<YYYY-MM>/posts.json` in both Page folders and write the posts as `draft`.
