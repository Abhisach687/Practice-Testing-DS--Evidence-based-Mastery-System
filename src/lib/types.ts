export type StudyResult = "correct" | "hinted" | "incorrect";
export type QueueSource = "due" | "weak" | "fresh" | "relearn";
export type ItemType =
  | "flashcard"
  | "mcq"
  | "short_answer"
  | "code_trace"
  | "predict_output"
  | "bug_fix"
  | "code_exercise"
  | "project_checkpoint";

export interface SourceAnchor {
  bookId: string;
  keywords: string[];
}

export interface Choice {
  id: string;
  label: string;
}

export interface LearningItem {
  id: string;
  conceptId: string;
  type: ItemType;
  prompt: string;
  answerMode: "self_check" | "multiple_choice" | "text" | "code";
  evaluationMode: "self" | "auto" | "pyodide";
  hints: string[];
  solution: {
    summary: string;
    followUp?: string;
    checklist?: string[];
    code?: string;
  };
  code?: string;
  choices?: Choice[];
  correctChoiceId?: string;
  acceptedAnswers?: string[];
  starterCode?: string;
  pyodide?: {
    packages: string[];
    tests: string;
  };
}

export interface ConceptSummary {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  prerequisites: string[];
  masteryThreshold: number;
  workedExample: boolean;
  itemCount: number;
  sourceAnchors: SourceAnchor[];
}

export interface ConceptDetail extends ConceptSummary {
  items: LearningItem[];
}

export interface BookSummary {
  bookId: string;
  title: string;
  shortTitle: string;
  totalPages: number;
  chapterCount: number;
  coveredChapterCount: number;
  sectionsCovered: number;
  sectionsTotal: number;
  extraction: {
    available: boolean;
  };
}

export interface RuntimeIndex {
  generatedAt: string;
  scheduler: {
    sameSessionOffset: number;
    sameSessionWindow: [number, number];
    intervalsInDays: number[];
    queueMix: {
      due: number;
      weak: number;
      fresh: number;
    };
  };
  books: BookSummary[];
  concepts: ConceptSummary[];
}

export interface ReviewState {
  conceptId: string;
  intervalLevel: number;
  dueAt: string;
  streak: number;
  lapses: number;
  ease: number;
  itemCursor: number;
  successfulReviews: number;
  lastStudiedAt?: string;
  lastResult?: StudyResult;
}

export interface SessionCard {
  conceptId: string;
  itemId: string;
  source: QueueSource;
}

export interface RelearnCard extends SessionCard {
  dueAfterCards: number;
}

export interface PyodideJob {
  script: string;
  packages?: string[];
  tests?: string;
  context?: Record<string, unknown>;
  timeoutMs?: number;
}

export interface PyodideExecutionResult {
  passed: boolean;
  message: string;
  stdout?: string[];
  stderr?: string[];
}

export interface ReviewExportPayload {
  exportedAt: string;
  runtimeGeneratedAt: string;
  reviewStates: ReviewState[];
}
