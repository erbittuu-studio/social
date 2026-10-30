# Hashtags and taglines

Status: decided by research; test against the Pages' own numbers after the first weeks.

## What the research says

- Most sources agree on two to three hashtags on a Facebook post, at the end of the text. Many hashtags look spammy and Instagram habits do not carry over. Hashtags help search and tracking more than reach. There is no official Meta number.
- The Hindu devotional tags found in the research come mostly from Instagram data, with `#hanumanchalisa` the largest. Treat them as a starting point and test them.
- For young children's apps the reader is the parent, so the tags speak to parents: early learning, preschool, toddler activities, coloring pages.

Sources: [ContentStudio](https://contentstudio.io/blog/facebook-hashtags), [Sprout Social](https://sproutsocial.com/insights/facebook-hashtags/), [Planly](https://planly.com/hashtags-on-facebook/), [IQ Hashtags](https://iqhashtags.com/hashtags/hashtag/hanumanchalisa), [The Educator's Spin On It](https://theeducatorsspinonit.com/top-hashtags-to-use-and-search-for).

## Decision

Three hashtags on every post: the app's name, then two topic tags. They are kept in `config/apps.json`. A post can replace the third with an event tag through its `tags` field, for example `#Diwali`.

| App | Hashtags |
|---|---|
| Colorful | #Colorful #ColoringPages #ToddlerActivities |
| ABC Learning | #ABCLearning #EarlyLearning #Preschool |
| Drawing Pad | #DrawingPad #Sketch #Doodle |
| Prarthana | #Prarthana #HanumanChalisa #Aarti |

## Taglines

- Kids Page: "Draw it. Color it. Learn it."
- Prarthana Page: "Your daily prayers, close at hand." It is already on the App Store header and the Page cover.

## Measure

After the first weeks compare reactions and shares in Page Insights, and App Store visits through each post's custom page link (`ppid`). Replace a hashtag that adds nothing.
