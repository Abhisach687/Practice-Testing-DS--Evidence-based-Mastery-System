import path from "node:path";
import { books } from "../content/source/books/index.mjs";
import { ensureDir, writeJson } from "./lib/content-helpers.mjs";
import { extractBook } from "./lib/pdf-utils.mjs";

const outputRoot = path.resolve("generated/extracted");

async function main() {
  await ensureDir(outputRoot);
  const results = [];

  for (const book of books) {
    const result = await extractBook(book, outputRoot);
    results.push({
      bookId: book.id,
      totalPages: result.totalPages,
      chapterCount: result.chapters.length,
      chapterFiles: result.chapterFiles
    });
  }

  await writeJson(path.join(outputRoot, "manifest.json"), {
    generatedAt: new Date().toISOString(),
    books: results
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
