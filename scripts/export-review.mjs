import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));
const names = { hi: "Hindi", gu: "Gujarati" };
const posts = [];
for (const month of readdirSync(new URL("pages/prarthana/", root)).filter((n) => /^\d{4}-\d{2}$/.test(n))) {
  posts.push(...read(`pages/prarthana/${month}/posts.json`));
}
const lines = ["# Hindi and Gujarati review", "", "For the native reader. Mark each line OK, or write the fix. The picture column shows what the post is posted with.", ""];
for (const lang of ["hi", "gu"]) {
  lines.push(`## ${names[lang]}`, "", "| # | Date | Picture | Text | OK or fix |", "|---|---|---|---|---|");
  posts
    .filter((p) => p.lang === lang && p.status === "draft")
    .forEach((p, i) => lines.push(`| ${i + 1} | ${p.at.slice(0, 10)} | ${p.image ? p.image.split("/").pop() : "text only"} | ${p.text} | |`));
  lines.push("");
}
writeFileSync(new URL("docs/REVIEW-hi-gu.md", root), `${lines.join("\n")}\n`);
console.log(`wrote ${posts.filter((p) => p.lang !== "en" && p.status === "draft").length} lines`);
