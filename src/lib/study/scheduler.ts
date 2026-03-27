import type {
  ConceptDetail,
  ConceptSummary,
  QueueSource,
  ReviewState,
  SessionCard,
  StudyResult
} from "../types";

export const REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120];
export const SAME_SESSION_OFFSET = 4;
export const SESSION_SIZE = 12;

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getDefaultReviewState(conceptId: string, now: Date): ReviewState {
  return {
    conceptId,
    intervalLevel: 0,
    dueAt: now.toISOString(),
    streak: 0,
    lapses: 0,
    ease: 1,
    itemCursor: 0,
    successfulReviews: 0
  };
}

export function isConceptUnlocked(
  concept: ConceptSummary,
  reviewStates: Record<string, ReviewState>
) {
  if (concept.prerequisites.length === 0) {
    return true;
  }

  return concept.prerequisites.every((prerequisite) => {
    const reviewState = reviewStates[prerequisite];
    return Boolean(reviewState && reviewState.successfulReviews > 0);
  });
}

function chooseItemId(concept: ConceptDetail, reviewState?: ReviewState) {
  const index = reviewState ? reviewState.itemCursor % concept.items.length : 0;
  return concept.items[index].id;
}

function sortByDueDate(a: ReviewState, b: ReviewState) {
  return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
}

function uniqueConcepts<T extends { conceptId: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.conceptId)) {
      return false;
    }
    seen.add(item.conceptId);
    return true;
  });
}

export function buildStudyQueue({
  concepts,
  reviewStates,
  now,
  size = SESSION_SIZE
}: {
  concepts: Record<string, ConceptDetail>;
  reviewStates: Record<string, ReviewState>;
  now: Date;
  size?: number;
}): SessionCard[] {
  const summaries = Object.values(concepts);
  const unlocked = summaries.filter((concept) =>
    isConceptUnlocked(concept, reviewStates)
  );

  const dueCandidates = uniqueConcepts(
    unlocked
      .map((concept) => ({
        conceptId: concept.id,
        reviewState: reviewStates[concept.id]
      }))
      .filter((entry) => entry.reviewState)
      .filter(
        (entry) =>
          new Date(entry.reviewState!.dueAt).getTime() <= now.getTime()
      )
      .sort((left, right) => sortByDueDate(left.reviewState!, right.reviewState!))
      .map((entry) => ({
        conceptId: entry.conceptId,
        itemId: chooseItemId(concepts[entry.conceptId], entry.reviewState),
        source: "due" as QueueSource
      }))
  );

  const weakCandidates = uniqueConcepts(
    unlocked
      .map((concept) => ({
        conceptId: concept.id,
        reviewState: reviewStates[concept.id]
      }))
      .filter((entry) => entry.reviewState)
      .filter((entry) => !dueCandidates.some((card) => card.conceptId === entry.conceptId))
      .sort(
        (left, right) =>
          (right.reviewState?.lapses ?? 0) - (left.reviewState?.lapses ?? 0) ||
          (left.reviewState?.intervalLevel ?? 0) -
            (right.reviewState?.intervalLevel ?? 0)
      )
      .map((entry) => ({
        conceptId: entry.conceptId,
        itemId: chooseItemId(concepts[entry.conceptId], entry.reviewState),
        source: "weak" as QueueSource
      }))
  );

  const freshCandidates = unlocked
    .filter((concept) => !reviewStates[concept.id])
    .map((concept) => ({
      conceptId: concept.id,
      itemId: chooseItemId(concept),
      source: "fresh" as QueueSource
    }));

  const dueTarget = Math.round(size * 0.7);
  const weakTarget = Math.round(size * 0.2);
  const freshTarget = Math.max(1, size - dueTarget - weakTarget);

  const queue = [
    ...dueCandidates.slice(0, dueTarget),
    ...weakCandidates.slice(0, weakTarget),
    ...freshCandidates.slice(0, freshTarget)
  ];

  const fallbacks = [...dueCandidates, ...weakCandidates, ...freshCandidates].filter(
    (card) => !queue.some((queued) => queued.conceptId === card.conceptId)
  );

  for (const fallback of fallbacks) {
    if (queue.length >= size) {
      break;
    }
    queue.push(fallback);
  }

  return queue;
}

export function applyReviewOutcome(
  currentState: ReviewState,
  outcome: StudyResult,
  now: Date
): ReviewState {
  const nextState: ReviewState = {
    ...currentState,
    itemCursor: currentState.itemCursor + 1,
    lastStudiedAt: now.toISOString(),
    lastResult: outcome
  };

  if (outcome === "correct") {
    const intervalLevel = Math.min(
      currentState.intervalLevel + 1,
      REVIEW_INTERVALS.length - 1
    );
    nextState.intervalLevel = intervalLevel;
    nextState.streak = currentState.streak + 1;
    nextState.successfulReviews = currentState.successfulReviews + 1;
    nextState.ease = Math.min(2, currentState.ease + 0.1);
    nextState.dueAt = addDays(now, REVIEW_INTERVALS[intervalLevel]).toISOString();
    return nextState;
  }

  if (outcome === "hinted") {
    const intervalLevel =
      currentState.intervalLevel === 0 ? 1 : currentState.intervalLevel;
    nextState.intervalLevel = intervalLevel;
    nextState.streak = Math.max(1, currentState.streak);
    nextState.successfulReviews = currentState.successfulReviews + 1;
    nextState.ease = Math.max(0.9, currentState.ease - 0.05);
    nextState.dueAt = addDays(now, REVIEW_INTERVALS[intervalLevel]).toISOString();
    return nextState;
  }

  nextState.intervalLevel = 1;
  nextState.streak = 0;
  nextState.lapses = currentState.lapses + 1;
  nextState.ease = Math.max(0.7, currentState.ease - 0.15);
  nextState.dueAt = addDays(now, REVIEW_INTERVALS[1]).toISOString();
  return nextState;
}
