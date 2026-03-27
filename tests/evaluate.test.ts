import { describe, expect, it } from "vitest";
import { evaluateAutoItem } from "../src/lib/study/evaluate";
import type { LearningItem } from "../src/lib/types";

function makeTextItem(overrides: Partial<LearningItem> = {}): LearningItem {
  return {
    id: "item-1",
    conceptId: "concept-1",
    type: "short_answer",
    prompt: "Prompt",
    answerMode: "text",
    evaluationMode: "auto",
    hints: [],
    acceptedAnswers: ["where the error happened", "stack of calls", "error message"],
    solution: {
      summary: "Solution"
    },
    ...overrides
  };
}

describe("evaluateAutoItem", () => {
  it("rejects blank text answers", () => {
    const result = evaluateAutoItem(makeTextItem(), "");

    expect(result.passed).toBe(false);
    expect(result.message).toContain("Enter an answer");
  });

  it("rejects overly short partial matches", () => {
    const result = evaluateAutoItem(
      makeTextItem({
        acceptedAnswers: ["estimated probability of heads"]
      }),
      "probability"
    );

    expect(result.passed).toBe(false);
  });

  it("accepts fuller answers that contain an accepted target idea", () => {
    const result = evaluateAutoItem(
      makeTextItem(),
      "A traceback helps show where the error happened and the stack of calls."
    );

    expect(result.passed).toBe(true);
  });

  it("requires exact normalized output for predict-output items", () => {
    const result = evaluateAutoItem(
      makeTextItem({
        type: "predict_output",
        acceptedAnswers: ["10\n15"]
      }),
      "10"
    );

    expect(result.passed).toBe(false);
  });

  it("rejects empty multiple-choice submissions", () => {
    const result = evaluateAutoItem(
      makeTextItem({
        type: "mcq",
        answerMode: "multiple_choice",
        acceptedAnswers: undefined,
        choices: [
          { id: "a", label: "A" },
          { id: "b", label: "B" }
        ],
        correctChoiceId: "a"
      }),
      ""
    );

    expect(result.passed).toBe(false);
    expect(result.message).toContain("Choose an option");
  });
});
