# The Facebook key (token)

One key posts to both Pages. It is never written in this repo. It lives in the GitHub secret `FB_PAGES_TOKEN` and in the owner's `secrets` folder.

## What it is

- Meta app: PES Social Poster, app id 2324010558353249, published Live.
- Configuration: PES Pages System, id 1467926325432206, a Facebook Login for Business configuration of type system-user token, with the Pages asset and the permissions `pages_manage_posts`, `pages_show_list` and `pages_read_engagement`.
- The token never expires. It belongs to the system user "PES Social Poster System User", which holds both Pages with the CREATE_CONTENT task.
- The script reads each Page's own key from the system user's Page list (`me/accounts`), so only this one key is stored.

## Create a new key

1. Open the Graph API Explorer (developers.facebook.com/tools/explorer).
2. Choose the Meta app PES Social Poster.
3. Open the Configurations tab, not the Permissions tab. A token from the Permissions tab is a user token and cannot post to the Pages.
4. Pick PES Pages System and press Generate. Facebook asks you to confirm in a popup: click it yourself.
5. Copy the token. Do not paste it into a chat, a file in this repo or a command you show.

## Save it

1. Put it in your own `secrets` folder, in a note such as `facebook-pages.md`, with the app id, configuration id, the two Page ids and the date made.
2. Set the GitHub secret. Run this in a terminal, paste the token when it asks, and press Enter:

   `gh secret set FB_PAGES_TOKEN --repo erbittuu-studio/social`

   Or use the repo's Settings, Secrets and variables, Actions, New repository secret, name `FB_PAGES_TOKEN`.

## Test it

Actions tab, workflow post, Run workflow, mode `check`. It passes when both Pages list the task CREATE_CONTENT. Mode `dry` needs no key and only lists what would be scheduled.

## Replace or revoke it

A key shown in a chat counts as exposed. To revoke, remove the app at facebook.com/settings?tab=business_tools, then create a new key as above and overwrite the secret with the same command.
