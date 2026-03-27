import { openDB } from "idb";
import type { ReviewExportPayload, ReviewState } from "../types";

const DB_NAME = "practice-testing-ds";
const DB_VERSION = 1;
const REVIEW_STORE = "review_state";

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(REVIEW_STORE)) {
        database.createObjectStore(REVIEW_STORE, { keyPath: "conceptId" });
      }
    }
  });
}

export async function listReviewStates(): Promise<ReviewState[]> {
  const db = await getDb();
  return db.getAll(REVIEW_STORE);
}

export async function saveReviewState(reviewState: ReviewState): Promise<void> {
  const db = await getDb();
  await db.put(REVIEW_STORE, reviewState);
}

export async function saveReviewStates(reviewStates: ReviewState[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(REVIEW_STORE, "readwrite");
  for (const reviewState of reviewStates) {
    await tx.store.put(reviewState);
  }
  await tx.done;
}

export async function replaceReviewStates(reviewStates: ReviewState[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(REVIEW_STORE, "readwrite");
  await tx.store.clear();
  for (const reviewState of reviewStates) {
    await tx.store.put(reviewState);
  }
  await tx.done;
}

export async function exportReviewStates(
  runtimeGeneratedAt: string
): Promise<ReviewExportPayload> {
  const reviewStates = await listReviewStates();
  return {
    exportedAt: new Date().toISOString(),
    runtimeGeneratedAt,
    reviewStates
  };
}
