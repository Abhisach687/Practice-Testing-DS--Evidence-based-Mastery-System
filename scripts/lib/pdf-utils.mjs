import fs from "node:fs/promises";
import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function resolveDestination(document, dest) {
  if (!dest) {
    return null;
  }

  const destination =
    typeof dest === "string" ? await document.getDestination(dest) : dest;

  if (!Array.isArray(destination) || destination.length === 0) {
    return null;
  }

  const pageIndex = await document.getPageIndex(destination[0]);
  return pageIndex;
}

async function flattenOutline(document, items, depth = 0, parentId = null) {
  const results = [];

  for (const item of items ?? []) {
    const pageIndex = await resolveDestination(document, item.dest).catch(
      () => null
    );
    const id = `${parentId ?? "root"}:${slugify(item.title)}:${results.length}`;
    results.push({
      id,
      parentId,
      depth,
      title: item.title.trim(),
      pageIndex,
      rawDest: item.dest ?? null
    });

    if (item.items?.length) {
      results.push(...(await flattenOutline(document, item.items, depth + 1, id)));
    }
  }

  return results;
}

function isIgnoredTitle(title, manifest) {
  return manifest.ignorePatterns.some((pattern) => pattern.test(title));
}

function groupChapters(flatOutline, manifest) {
  const chapters = flatOutline
    .filter((entry) => entry.depth === manifest.chapterDepth)
    .filter((entry) =>
      manifest.chapterIncludePatterns?.length
        ? manifest.chapterIncludePatterns.some((pattern) => pattern.test(entry.title))
        : true
    )
    .filter((entry) => !isIgnoredTitle(entry.title, manifest));

  return chapters.map((chapter, index) => {
    const nextChapter = chapters[index + 1];
    const sections = flatOutline
      .filter((entry) => entry.parentId === chapter.id)
      .filter((entry) => entry.depth === manifest.sectionDepth)
      .filter((entry) => !isIgnoredTitle(entry.title, manifest))
      .map((section) => ({
        id: slugify(section.title),
        title: section.title,
        pageStart: section.pageIndex === null ? null : section.pageIndex + 1
      }));

    return {
      id: slugify(chapter.title),
      title: chapter.title,
      pageStart: chapter.pageIndex === null ? null : chapter.pageIndex + 1,
      pageEnd:
        nextChapter?.pageIndex === null || nextChapter?.pageIndex === undefined
          ? null
          : nextChapter.pageIndex,
      sections
    };
  });
}

async function extractPageText(document, pageNumber) {
  const page = await document.getPage(pageNumber);
  const textContent = await page.getTextContent();
  return textContent.items
    .map((item) => ("str" in item ? item.str : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function inspectBook(manifest) {
  const document = await getDocument(manifest.pdfPath).promise;
  const meta = await document.getMetadata().catch(() => null);
  const outline = await document.getOutline();
  const flatOutline = await flattenOutline(document, outline);
  const chapters = groupChapters(flatOutline, manifest);

  return {
    manifest,
    totalPages: document.numPages,
    info: meta?.info ?? {},
    chapters
  };
}

export async function extractBook(manifest, outputRoot) {
  const inspection = await inspectBook(manifest);
  const document = await getDocument(manifest.pdfPath).promise;
  const bookOutputDir = path.join(outputRoot, manifest.id);
  await fs.mkdir(bookOutputDir, { recursive: true });

  const chapterFiles = [];

  for (const chapter of inspection.chapters) {
    const startPage = chapter.pageStart ?? 1;
    const lastPage = chapter.pageEnd ?? Math.min(startPage + 10, inspection.totalPages);
    const pages = [];

    for (let pageNumber = startPage; pageNumber <= lastPage; pageNumber += 1) {
      const text = await extractPageText(document, pageNumber);
      pages.push({
        pageNumber,
        text
      });
    }

    const chapterPayload = {
      bookId: manifest.id,
      chapterId: chapter.id,
      title: chapter.title,
      pageStart: startPage,
      pageEnd: lastPage,
      sections: chapter.sections,
      pages
    };
    const chapterPath = path.join(bookOutputDir, `${chapter.id}.json`);
    await fs.writeFile(chapterPath, JSON.stringify(chapterPayload, null, 2));
    chapterFiles.push(chapterPath);
  }

  return {
    ...inspection,
    chapterFiles
  };
}
