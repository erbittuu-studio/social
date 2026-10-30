import { readFileSync, writeFileSync, existsSync } from "node:fs";

const API = "https://graph.facebook.com/v26.0";
const args = process.argv.slice(2);
const send = args.includes("--send");
const check = args.includes("--check");
const only = args.includes("--page") ? args[args.indexOf("--page") + 1] : null;
const read = (file) => JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8"));
const pages = read("pages.json");
const apps = read("apps.json");
const state = read("state.json");

function message(entry) {
  const tags = apps[entry.app].tags.map((tag) => `#${tag}`).join(" ");
  return [
    entry.text,
    "",
    `App Store: https://apps.apple.com/app/id${entry.app}`,
    `Website: https://erbittuu-studio.web.app/apps/${entry.app}`,
    "",
    tags,
  ].join("\n");
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

function publish(page, entry, token) {
  const form = new FormData();
  const imageFile = new URL(`images/${entry.app}.png`, import.meta.url);
  if (existsSync(imageFile)) {
    form.append("source", new Blob([readFileSync(imageFile)], { type: "image/png" }), `${entry.app}.png`);
    form.append("caption", message(entry));
    return request(`${page.id}/photos`, token, form);
  }
  form.append("message", message(entry));
  form.append("link", `https://apps.apple.com/app/id${entry.app}`);
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
      const info = await request(`${page.id}?fields=name,can_post`, token);
      console.log(`${page.name}: can_post ${info.can_post}`);
      if (!info.can_post) failed = true;
    } catch (error) {
      console.error(`${page.name}: ${error.message}`);
      failed = true;
    }
    continue;
  }

  const done = state[page.key] ?? [];
  const next = read(page.posts).find((entry) => !done.includes(entry.day));
  if (!next) {
    console.log(`${page.name}: nothing left to post`);
    continue;
  }
  console.log(`${page.name}: day ${next.day}\n${message(next)}\n`);
  if (!send) continue;
  if (!token) {
    console.error(`${page.tokenEnv} is not set`);
    failed = true;
    continue;
  }
  try {
    const result = await publish(page, next, token);
    console.log(`posted ${result.post_id ?? result.id}`);
    state[page.key] = [...done, next.day];
  } catch (error) {
    console.error(error.message);
    failed = true;
  }
}

if (send && !check) writeFileSync(new URL("state.json", import.meta.url), `${JSON.stringify(state, null, 2)}\n`);
process.exit(failed ? 1 : 0);
