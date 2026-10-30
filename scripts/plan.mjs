import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));
const plan = read("config/plan.json");
const apps = read("config/apps.json");
const eventTags = read("config/events.json");
const maxUses = 3;
const banned = [/—/, /\bfree\b/i, /\bdownload now\b/i];

const dayMs = 86400000;
const first = Date.parse(`${plan.start}T00:00:00Z`);
const dates = Array.from({ length: plan.days }, (_, i) => new Date(first + i * dayMs).toISOString().slice(0, 10));

function load(app) {
  const items = read(`content/${app}.json`);
  for (const item of items) {
    for (const text of item.texts) {
      if (banned.some((rule) => rule.test(text))) throw new Error(`banned wording in ${item.image}: ${text}`);
    }
    if (item.image && !existsSync(new URL(imagePath(app, item), root))) throw new Error(`missing picture ${item.image}`);
  }
  return items;
}

function imagePath(app, item) {
  return item.image.includes("/") ? item.image : `images/screens/${app}/${item.image}`;
}

function ppidOf(app, item) {
  const slug = item.image.includes("/") ? null : item.image.replace(/-\d+\.jpg$/, "");
  const links = read(`../faststore/data/apps/${app}/store-links.json`).pages ?? {};
  return slug && links[slug] ? links[slug].id : undefined;
}

function groupKey(item) {
  return item.image.replace(/-\d+\.jpg$/, "");
}

function generalQueue(items) {
  const groups = new Map();
  for (const item of items.filter((i) => !i.days)) {
    const key = groupKey(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const lists = [...groups.values()];
  const queue = [];
  for (let round = 0; round < maxUses; round += 1) {
    const rotated = [...lists.slice(round % lists.length), ...lists.slice(0, round % lists.length)];
    const depth = Math.max(...lists.map((l) => l.length));
    for (let i = 0; i < depth; i += 1) {
      for (const list of rotated) {
        const item = list[(i + round) % list.length];
        if (i < list.length && round < item.texts.length) queue.push({ item, use: round });
      }
    }
  }
  return queue;
}

function eventUses(items) {
  const map = new Map();
  for (const item of items.filter((i) => i.days)) {
    item.days.forEach((day, i) => map.set(day, { item, use: i }));
  }
  return map;
}

function lay(app, count) {
  const items = load(app);
  const events = eventUses(items);
  const queue = generalQueue(items);
  const out = [];
  let next = 0;
  for (const date of dates.slice(0, count)) {
    const event = events.get(date);
    if (event) out.push({ date, ...event });
    else if (next < queue.length) out.push({ date, ...queue[next++] });
    else break;
  }
  return out;
}

function entry(page, app, date, time, suffix, picked) {
  const { item, use } = picked;
  const post = {
    id: `${page}-${date}-${app}${suffix}`,
    at: `${date}T${time}:00Z`,
    app,
    lang: item.lang ?? "en",
    event: item.event ?? null
  };
  if (item.image) post.image = imagePath(app, item);
  post.text = item.texts[use];
  const ppid = item.image ? ppidOf(app, item) : undefined;
  if (ppid) post.ppid = ppid;
  if (post.event) post.tags = [...apps[app].tags.slice(0, 2), eventTags[post.event]];
  post.status = "draft";
  return post;
}

function save(page, entries) {
  const months = new Map();
  for (const e of entries) months.set(e.at.slice(0, 7), [...(months.get(e.at.slice(0, 7)) ?? []), e]);
  for (const [month, list] of months) {
    const file = new URL(`pages/${page}/${month}/posts.json`, root);
    const kept = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")).filter((e) => e.status !== "draft") : [];
    mkdirSync(new URL(`pages/${page}/${month}/`, root), { recursive: true });
    const all = [...kept, ...list].sort((a, b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id));
    writeFileSync(file, `${JSON.stringify(all, null, 2)}\n`);
  }
}

const kidsLays = plan.kids.slots.map((slot) => ({ slot, days: lay(slot.app, plan.days) }));
const kidsDays = Math.min(...kidsLays.map((l) => l.days.length));
const kids = kidsLays.flatMap(({ slot, days }) => days.slice(0, kidsDays).map((d) => entry("kids", slot.app, d.date, slot.at, "", d)));
save("kids", kids);
console.log(`kids: ${kidsDays} days, ${kids.length} posts, last ${dates[kidsDays - 1]}`);

const prarthana = [];
const { evening, morning, weekdays } = plan.prarthana;
const items = load(evening.app);
const events = eventUses(items);
const queues = Object.fromEntries(["en", "hi", "gu"].map((lang) => [lang, generalQueue(items.filter((i) => (i.lang ?? "en") === lang))]));
const cursor = { en: 0, hi: 0, gu: 0 };
const mornings = read(`content/${morning.app}-morning.json`);
const morningCursor = { en: 0, hi: 0, gu: 0 };
const mornEvents = new Map(mornings.filter((m) => m.day).map((m) => [m.day, m]));
const mornGeneral = Object.fromEntries(["en", "hi", "gu"].map((lang) => [lang, mornings.filter((m) => !m.day && m.lang === lang)]));
for (const date of dates) {
  const lang = weekdays[new Date(`${date}T00:00:00Z`).getUTCDay()];
  const event = events.get(date);
  const picked = event ?? queues[lang][cursor[lang]++];
  if (!picked) throw new Error(`out of ${lang} pictures on ${date}`);
  prarthana.push(entry("prarthana", evening.app, date, evening.at, "-pm", { date, ...picked }));
  const m = mornEvents.get(date) ?? mornGeneral[lang][morningCursor[lang]++];
  if (!m) throw new Error(`out of ${lang} morning texts on ${date}`);
  prarthana.push(entry("prarthana", morning.app, date, morning.at, "-am", { item: { lang: m.lang, event: m.event ?? null, texts: [m.text] }, use: 0 }));
}
save("prarthana", prarthana);
console.log(`prarthana: ${dates.length} days, ${prarthana.length} posts, last ${dates.at(-1)}`);
