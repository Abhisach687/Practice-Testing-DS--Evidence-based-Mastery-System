import { describe, expect, it } from "vitest";
import { applyReviewOutcome, buildStudyQueue, getDefaultReviewState } from "../src/lib/study/scheduler";
import type { ConceptDetail } from "../src/lib/types";

function makeConcept(id: string, prerequisites: string[] = []): ConceptDetail {
  return {
    id,
    title: id,
    summary: `${id} summary`,
    tags: [],
    prerequisites,
    masteryThreshold: 4,
    workedExample: false,
    itemCount: 1,
    sourceAnchors: [],
    items: [
      {
        id: `${id}__item`,
        conceptId: id,
        type: "flashcard",
        prompt: `${id} prompt`,
        answerMode: "self_check",
        evaluationMode: "self",
        hints: [],
        solution: {
          summary: `${id} solution`
        }
      }
    ]
  };
}

describe("scheduler", () => {
  it("promotes a correct answer up the mountain", () => {
    const now = new Date("2026-03-27T00:00:00.000Z");
    const state = getDefaultReviewState("alpha", now);
    const updated = applyReviewOutcome(state, "correct", now);

    expect(updated.intervalLevel).toBe(1);
    expect(updated.successfulReviews).toBe(1);
    expect(updated.dueAt).not.toBe(state.dueAt);
  });

  it("keeps hinted reviews slower than fully correct reviews", () => {
    const now = new Date("2026-03-27T00:00:00.000Z");
    const state = { ...getDefaultReviewState("alpha", now), intervalLevel: 3, successfulReviews: 3 };
    const updated = applyReviewOutcome(state, "hinted", now);

    expect(updated.intervalLevel).toBe(3);
    expect(updated.successfulReviews).toBe(4);
  });

  it("demotes incorrect reviews to a short interval", () => {
    const now = new Date("2026-03-27T00:00:00.000Z");
    const state = { ...getDefaultReviewState("alpha", now), intervalLevel: 5, successfulReviews: 5 };
    const updated = applyReviewOutcome(state, "incorrect", now);

    expect(updated.intervalLevel).toBe(1);
    expect(updated.lapses).toBe(1);
    expect(updated.streak).toBe(0);
  });

  it("builds a queue that respects prerequisite unlocks", () => {
    const concepts = {
      alpha: makeConcept("alpha"),
      beta: makeConcept("beta", ["alpha"])
    };
    const now = new Date("2026-03-27T00:00:00.000Z");

    const initialQueue = buildStudyQueue({
      concepts,
      reviewStates: {},
      now,
      size: 4
    });

    expect(initialQueue.map((card) => card.conceptId)).toEqual(["alpha"]);

    const reviewStates = {
      alpha: {
        ...getDefaultReviewState("alpha", now),
        intervalLevel: 1,
        successfulReviews: 1,
        dueAt: now.toISOString()
      }
    };

    const unlockedQueue = buildStudyQueue({
      concepts,
      reviewStates,
      now,
      size: 4
    });

    expect(unlockedQueue.some((card) => card.conceptId === "beta")).toBe(true);
  });
});
