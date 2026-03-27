import type { LearningItem, PyodideExecutionResult } from "../types";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\r\n/g, "\n").replace(/\s+/g, " ");
}

function normalizeMultiline(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
}

export function evaluateAutoItem(
  item: LearningItem,
  answer: string
): PyodideExecutionResult {
  if (item.type === "mcq") {
    const passed = answer === item.correctChoiceId;
    return {
      passed,
      message: passed
        ? "Correct. You selected the best answer."
        : "Not quite. Compare your reasoning with the explanation."
    };
  }

  const acceptedAnswers = item.acceptedAnswers ?? [];
  const normalizedAnswer =
    item.type === "predict_output" || item.type === "code_trace"
      ? normalizeMultiline(answer)
      : normalize(answer);

  const passed = acceptedAnswers.some((accepted) => {
    const normalizedAccepted =
      item.type === "predict_output" || item.type === "code_trace"
        ? normalizeMultiline(accepted)
        : normalize(accepted);

    return (
      normalizedAnswer === normalizedAccepted ||
      normalizedAnswer.includes(normalizedAccepted) ||
      normalizedAccepted.includes(normalizedAnswer)
    );
  });

  return {
    passed,
    message: passed
      ? "Correct. Your answer matches the target idea."
      : "Not yet. Use a hint or compare your answer to the solution."
  };
}

export function itemNeedsCodeRunner(item: LearningItem) {
  return item.evaluationMode === "pyodide";
}
