import { createRequire } from "node:module";
import { mkdirSync, readdirSync, existsSync } from "node:fs";

const sharp = createRequire(new URL("../../faststore/package.json", import.meta.url))("sharp");
const media = new URL("../../faststore/data/media/", import.meta.url).pathname;
const out = new URL("../images/screens/", import.meta.url).pathname;
const apps = ["1547752865", "1597421237", "1597789030", "1597899453"];
const locales = { 1597899453: [["en-US", "store"], ["hi", "store-hi"], ["gu-IN", "store-gu"]] };

let made = 0;
async function convert(from, to) {
  await sharp(from).resize({ width: 1080 }).jpeg({ quality: 82 }).toFile(to);
  made += 1;
}

for (const app of apps) {
  const dir = `${out}${app}/`;
  mkdirSync(dir, { recursive: true });
  for (const [locale, prefix] of locales[app] ?? [["en-US", "store"]]) {
    const store = `${media}screenshots/${app}/appstore/${locale}/`;
    if (!existsSync(store)) continue;
    for (const file of readdirSync(store).filter((n) => n.startsWith("iPhone-6-9-"))) {
      await convert(`${store}${file}`, `${dir}${prefix}-${file.slice(-6, -4)}.jpg`);
    }
  }
  const pages = `${media}pages/${app}/`;
  for (const slug of readdirSync(pages)) {
    for (const file of readdirSync(`${pages}${slug}`).filter((n) => n.startsWith("iPhone-6-9-"))) {
      await convert(`${pages}${slug}/${file}`, `${dir}${slug}-${file.slice(-6, -4)}.jpg`);
    }
  }
}
console.log(`made ${made} pictures`);
