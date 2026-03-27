import fs from "node:fs/promises";
import path from "node:path";

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function ensureDir(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

export async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function matchesAnyKeyword(title, keywords) {
  const normalized = normalizeTitle(title);
  return keywords.some((keyword) => normalized.includes(normalizeTitle(keyword)));
}
