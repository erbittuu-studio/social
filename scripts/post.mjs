import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";

const API = "https://graph.facebook.com/v26.0";
const MINUTE = 60;
const args = process.argv.slice(2);
const send = args.includes("--send");
const check = args.includes("--check");
const value = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : null);
const only = value("--page");
const days = Number(value("--days") ?? 14);
const root = new URL("../", import.meta.url);
const read = (file) => JSON.parse(readFileSync(new URL(file, root), "utf8"));
const pages = read("config/pages.json");
const apps = read("config/apps.json");
const now = Math.floor(Date.now() / 1000);

function monthFiles(page) {
  return readdirSync(new URL(`pages/${page.folder}/`, root))
    .filter((name) => /^\d{4}-\d{2}$/.test(name))
    .sort()
    .map((month) => `pages/${page.folder}/${month}/posts.json`);
}

function message(entry) {
  const tags = (entry.tags ?? apps[entry.app].tags).map((tag) => `#${tag}`).join(" ");
  const store = `https://apps.apple.com/app/id${entry.app}${entry.ppid ? `?ppid=${entry.ppid}` : ""}`;
  return [entry.text, "", `App Store: ${store}`, `Website: https://erbittuu-studio.web.app/apps/${entry.app}`, "", tags].join("\n");
}

async function request(path, token, form) {
  const res = await fetch(`${API}/${path}`, {
    method: form ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${path}: ${json.error?.message ?? res.status}`);
  return json;
}

const pageTokens = new Map();

async function pageToken(page, token) {
  if (!pageTokens.has(token)) {
    const list = await request("me/accounts?fields=id,access_token&limit=100", token);
    pageTokens.set(token, new Map(list.data.map((item) => [item.id, item.access_token])));
  }
  return pageTokens.get(token).get(page.id) ?? token;
}

async function schedule(page, entry, userToken) {
  const token = await pageToken(page, userToken);
  const form = new FormData();
  form.append("published", "false");
  form.append("scheduled_publish_time", String(Math.floor(new Date(entry.at).getTime() / 1000)));
  const imageFile = new URL(entry.image, root);
  if (entry.image && existsSync(imageFile)) {
    const type = entry.image.endsWith(".png") ? "image/png" : "image/jpeg";
    form.append("source", new Blob([readFileSync(imageFile)], { type }), entry.image.split("/").pop());
    form.append("caption", message(entry));
    return request(`${page.id}/photos`, token, form);
  }
  form.append("message", message(entry));
  return request(`${page.id}/feed`, token, form);
}

let failed = false;

for (const page of pages) {
  if (only && page.key !== only) continue;
  const token = process.env[page.tokenEnv];

  if (check) {
    if (!token) {
      console.error(`${page.name}: ${page.tokenEnv} is not set`);
      failed = true;
      continue;
    }
    try {
      const list = await request("me/accounts?fields=id,name,tasks&limit=100", token);
      const found = list.data.find((item) => item.id === page.id);
      const ok = Boolean(found?.tasks?.includes("CREATE_CONTENT"));
      console.log(`${page.name}: ${found ? "listed" : "not listed"}, can create content ${ok}`);
      if (!ok) failed = true;
    } catch (error) {
      console.error(`${page.name}: ${error.message}`);
      failed = true;
    }
    continue;
  }

  const counts = {};
  for (const file of monthFiles(page)) {
    const entries = read(file);
    let changed = false;
    for (const entry of entries) {
      counts[entry.status] = (counts[entry.status] ?? 0) + 1;
      const at = Math.floor(new Date(entry.at).getTime() / 1000);
      const due = entry.status === "ready" && at >= now + 15 * MINUTE && at <= now + days * 86400;
      if (!due) continue;
      console.log(`${page.name}: ${entry.at} ${entry.id}\n${message(entry)}\n`);
      if (!send) continue;
      if (!token) {
        console.error(`${page.tokenEnv} is not set`);
        failed = true;
        continue;
      }
      try {
        const result = await schedule(page, entry, token);
        entry.fbId = result.post_id ?? result.id;
        entry.status = "scheduled";
        changed = true;
        console.log(`scheduled ${entry.fbId}`);
      } catch (error) {
        console.error(`${entry.id}: ${error.message}`);
        failed = true;
      }
    }
    if (changed) writeFileSync(new URL(file, root), `${JSON.stringify(entries, null, 2)}\n`);
  }
  console.log(`${page.name}: ${Object.entries(counts).map(([status, count]) => `${count} ${status}`).join(", ")}`);
}

process.exit(failed ? 1 : 0);
