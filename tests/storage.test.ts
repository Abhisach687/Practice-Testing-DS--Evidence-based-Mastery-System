import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import {
  exportReviewStates,
  listReviewStates,
  replaceReviewStates,
  saveReviewState
} from "../src/lib/storage/db";

describe("review state storage", () => {
  beforeEach(async () => {
    await replaceReviewStates([]);
  });

  it("saves and lists review states", async () => {
    await saveReviewState({
      conceptId: "alpha",
      intervalLevel: 1,
      dueAt: "2026-03-28T00:00:00.000Z",
      streak: 1,
      lapses: 0,
      ease: 1,
      itemCursor: 1,
      successfulReviews: 1
    });

    const states = await listReviewStates();
    expect(states).toHaveLength(1);
    expect(states[0]?.conceptId).toBe("alpha");
  });

  it("replaces review states on import", async () => {
    await replaceReviewStates([
      {
        conceptId: "alpha",
        intervalLevel: 1,
        dueAt: "2026-03-28T00:00:00.000Z",
        streak: 1,
        lapses: 0,
        ease: 1,
        itemCursor: 1,
        successfulReviews: 1
      },
      {
        conceptId: "beta",
        intervalLevel: 2,
        dueAt: "2026-03-30T00:00:00.000Z",
        streak: 2,
        lapses: 0,
        ease: 1.1,
        itemCursor: 2,
        successfulReviews: 2
      }
    ]);

    const exported = await exportReviewStates("runtime-stamp");
    expect(exported.reviewStates).toHaveLength(2);
    expect(exported.runtimeGeneratedAt).toBe("runtime-stamp");
  });
});
