import fs from "node:fs/promises";
import path from "node:path";
import { books } from "../content/source/books/index.mjs";
import { concepts } from "../content/source/packs/index.mjs";
import {
  ensureDir,
  matchesAnyKeyword,
  writeJson
} from "./lib/content-helpers.mjs";
import { inspectBook } from "./lib/pdf-utils.mjs";

const outputRoot = path.resolve("public/data");

function validateContentGraph() {
  const conceptIds = new Set();
  const itemIds = new Set();
  const bookIds = new Set(books.map((book) => book.id));

  for (const concept of concepts) {
    if (conceptIds.has(concept.id)) {
      throw new Error(`Duplicate concept id: ${concept.id}`);
    }
    conceptIds.add(concept.id);

    for (const prerequisite of concept.prerequisites) {
      if (!conceptIds.has(prerequisite) && !concepts.find((item) => item.id === prerequisite)) {
        throw new Error(
          `Concept ${concept.id} references missing prerequisite ${prerequisite}`
        );
      }
    }

    for (const anchor of concept.sourceAnchors) {
      if (!bookIds.has(anchor.bookId)) {
        throw new Error(
          `Concept ${concept.id} references unknown book ${anchor.bookId}`
        );
      }
      if (!anchor.keywords?.length) {
        throw new Error(`Concept ${concept.id} has an empty source anchor`);
      }
    }

    for (const item of concept.items) {
      if (itemIds.has(item.id)) {
        throw new Error(`Duplicate item id: ${item.id}`);
      }
      itemIds.add(item.id);
    }
  }
}

function conceptMatchesTitle(concept, bookId, title) {
  const anchor = concept.sourceAnchors.find((item) => item.bookId === bookId);
  if (!anchor) {
    return false;
  }

  return matchesAnyKeyword(title, anchor.keywords);
}

function computeCoverageForBook(bookInspection) {
  const chapters = bookInspection.chapters.map((chapter) => {
    const directConceptIds = concepts
      .filter((concept) => conceptMatchesTitle(concept, bookInspection.manifest.id, chapter.title))
      .map((concept) => concept.id);

    const sections = chapter.sections.map((section) => {
      const sectionConceptIds = concepts
        .filter((concept) =>
          conceptMatchesTitle(concept, bookInspection.manifest.id, section.title)
        )
        .map((concept) => concept.id);

      return {
        ...section,
        conceptIds: sectionConceptIds,
        itemIds: [...new Set(sectionConceptIds.flatMap((conceptId) => {
          const concept = concepts.find((item) => item.id === conceptId);
          return concept ? concept.items.map((item) => item.id) : [];
        }))]
      };
    });

    const conceptIds = [
      ...new Set([
        ...directConceptIds,
        ...sections.flatMap((section) => section.conceptIds)
      ])
    ];

    return {
      ...chapter,
      conceptIds,
      itemIds: [...new Set(conceptIds.flatMap((conceptId) => {
        const concept = concepts.find((item) => item.id === conceptId);
        return concept ? concept.items.map((item) => item.id) : [];
      }))],
      sections,
      status: conceptIds.length > 0 ? "covered" : "uncovered"
    };
  });

  const uncovered = chapters.filter((chapter) => chapter.status === "uncovered");
  if (uncovered.length > 0) {
    throw new Error(
      `Book ${bookInspection.manifest.id} has uncovered important chapters: ${uncovered
        .map((chapter) => chapter.title)
        .join(", ")}`
    );
  }

  return {
    bookId: bookInspection.manifest.id,
    title: bookInspection.manifest.title,
    shortTitle: bookInspection.manifest.shortTitle,
    totalPages: bookInspection.totalPages,
    chapterCount: chapters.length,
    coveredChapterCount: chapters.length - uncovered.length,
    sectionsCovered: chapters.reduce(
      (total, chapter) =>
        total + chapter.sections.filter((section) => section.conceptIds.length > 0).length,
      0
    ),
    sectionsTotal: chapters.reduce((total, chapter) => total + chapter.sections.length, 0),
    chapters
  };
}

async function buildConceptShards() {
  const conceptSummaries = [];

  for (const concept of concepts) {
    const payload = {
      ...concept,
      itemCount: concept.items.length
    };

    await writeJson(path.join(outputRoot, "concepts", `${concept.id}.json`), payload);

    conceptSummaries.push({
      id: concept.id,
      title: concept.title,
      summary: concept.summary,
      tags: concept.tags,
      prerequisites: concept.prerequisites,
      masteryThreshold: concept.masteryThreshold,
      workedExample: concept.workedExample,
      itemCount: concept.items.length,
      sourceAnchors: concept.sourceAnchors
    });
  }

  return conceptSummaries;
}

async function buildBookShards() {
  const inspections = [];
  for (const book of books) {
    inspections.push(await inspectBook(book));
  }

  const coveragePayloads = inspections.map((inspection) =>
    computeCoverageForBook(inspection)
  );

  for (const coverage of coveragePayloads) {
    await writeJson(path.join(outputRoot, "books", `${coverage.bookId}.json`), coverage);
  }

  return coveragePayloads;
}

async function extractionStatusByBook() {
  const status = {};
  for (const book of books) {
    const extractedDir = path.resolve("generated/extracted", book.id);
    const exists = await fs
      .stat(extractedDir)
      .then(() => true)
      .catch(() => false);
    status[book.id] = { available: exists };
  }
  return status;
}

async function main() {
  validateContentGraph();
  await ensureDir(outputRoot);

  const [conceptSummaries, bookCoverage, extractionStatus] = await Promise.all([
    buildConceptShards(),
    buildBookShards(),
    extractionStatusByBook()
  ]);

  const runtimeIndex = {
    generatedAt: new Date().toISOString(),
    scheduler: {
      sameSessionOffset: 4,
      sameSessionWindow: [3, 5],
      intervalsInDays: [0, 1, 3, 7, 14, 30, 60, 120],
      queueMix: {
        due: 0.7,
        weak: 0.2,
        fresh: 0.1
      }
    },
    books: bookCoverage.map((book) => ({
      bookId: book.bookId,
      title: book.title,
      shortTitle: book.shortTitle,
      totalPages: book.totalPages,
      chapterCount: book.chapterCount,
      coveredChapterCount: book.coveredChapterCount,
      sectionsCovered: book.sectionsCovered,
      sectionsTotal: book.sectionsTotal,
      extraction: extractionStatus[book.bookId]
    })),
    concepts: conceptSummaries
  };

  await writeJson(path.join(outputRoot, "runtime-index.json"), runtimeIndex);
  await writeJson(path.join(outputRoot, "coverage-report.json"), {
    generatedAt: runtimeIndex.generatedAt,
    books: bookCoverage
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
