const DEFAULT_HINTS = ["Start by naming the concept you think this question is testing."];

export function createConcept({
  id,
  title,
  summary,
  tags,
  prerequisites = [],
  sourceAnchors = [],
  masteryThreshold = 4,
  workedExample = false,
  items
}) {
  return {
    id,
    title,
    summary,
    tags,
    prerequisites,
    sourceAnchors,
    masteryThreshold,
    workedExample,
    items: items.map((item) => ({
      conceptId: id,
      hints: DEFAULT_HINTS,
      ...item,
      id: `${id}__${item.id}`
    }))
  };
}

export function flashcard({
  id,
  prompt,
  answer,
  hints = [],
  followUp = "",
  rubric = []
}) {
  return {
    id,
    type: "flashcard",
    prompt,
    answerMode: "self_check",
    evaluationMode: "self",
    hints,
    solution: {
      summary: answer,
      followUp,
      checklist: rubric
    }
  };
}

export function mcq({
  id,
  prompt,
  choices,
  correctChoiceId,
  hints = [],
  explanation
}) {
  return {
    id,
    type: "mcq",
    prompt,
    answerMode: "multiple_choice",
    evaluationMode: "auto",
    choices,
    correctChoiceId,
    hints,
    solution: {
      summary: explanation
    }
  };
}

export function shortAnswer({
  id,
  type = "short_answer",
  prompt,
  acceptedAnswers,
  hints = [],
  explanation,
  rubric = []
}) {
  return {
    id,
    type,
    prompt,
    answerMode: "text",
    evaluationMode: "auto",
    acceptedAnswers,
    hints,
    solution: {
      summary: explanation,
      checklist: rubric
    }
  };
}

export function predictOutput({
  id,
  prompt,
  code,
  acceptedAnswers,
  hints = [],
  explanation
}) {
  return {
    id,
    type: "predict_output",
    prompt,
    answerMode: "text",
    evaluationMode: "auto",
    code,
    acceptedAnswers,
    hints,
    solution: {
      summary: explanation
    }
  };
}

export function codeTrace({
  id,
  prompt,
  code,
  acceptedAnswers,
  hints = [],
  explanation
}) {
  return {
    id,
    type: "code_trace",
    prompt,
    answerMode: "text",
    evaluationMode: "auto",
    code,
    acceptedAnswers,
    hints,
    solution: {
      summary: explanation
    }
  };
}

export function codeExercise({
  id,
  type = "code_exercise",
  prompt,
  starterCode,
  solutionCode,
  tests,
  packages = [],
  hints = [],
  rubric = []
}) {
  return {
    id,
    type,
    prompt,
    answerMode: "code",
    evaluationMode: "pyodide",
    starterCode,
    pyodide: {
      packages,
      tests
    },
    hints,
    solution: {
      summary: "Use the reference solution to compare structure, not just syntax.",
      code: solutionCode,
      checklist: rubric
    }
  };
}

export function projectCheckpoint({
  id,
  prompt,
  checklist,
  hints = [],
  reflection
}) {
  return {
    id,
    type: "project_checkpoint",
    prompt,
    answerMode: "self_check",
    evaluationMode: "self",
    hints,
    solution: {
      summary: reflection,
      checklist
    }
  };
}

export function bugFix({
  id,
  prompt,
  starterCode,
  solutionCode,
  tests,
  hints = [],
  rubric = []
}) {
  return codeExercise({
    id,
    type: "bug_fix",
    prompt,
    starterCode,
    solutionCode,
    tests,
    hints,
    rubric
  });
}
