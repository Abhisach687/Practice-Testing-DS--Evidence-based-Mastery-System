import { useEffect, useMemo, useRef, useState } from "react";
import { loadAllConceptDetails, loadRuntimeIndex } from "../lib/content-loader";
import { PyodideClient } from "../lib/pyodide/client";
import { exportReviewStates, listReviewStates, replaceReviewStates, saveReviewState } from "../lib/storage/db";
import { downloadJson, readImportFile } from "../lib/storage/export";
import {
  applyReviewOutcome,
  buildStudyQueue,
  getDefaultReviewState,
  SAME_SESSION_OFFSET,
  SESSION_SIZE
} from "../lib/study/scheduler";
import type {
  ConceptDetail,
  ReviewState,
  RelearnCard,
  RuntimeIndex,
  SessionCard,
  StudyResult
} from "../lib/types";

function keyByConcept(reviewStates: ReviewState[]) {
  return Object.fromEntries(reviewStates.map((reviewState) => [reviewState.conceptId, reviewState]));
}

function nextCardForConcept(
  concept: ConceptDetail,
  reviewState?: ReviewState,
  source: SessionCard["source"] = "fresh"
): SessionCard {
  const index = reviewState ? reviewState.itemCursor % concept.items.length : 0;
  return {
    conceptId: concept.id,
    itemId: concept.items[index].id,
    source
  };
}

function advanceSession({
  queue,
  relearns,
  finishedCard,
  concepts,
  reviewStates
}: {
  queue: SessionCard[];
  relearns: RelearnCard[];
  finishedCard: SessionCard;
  concepts: Record<string, ConceptDetail>;
  reviewStates: Record<string, ReviewState>;
}) {
  const remainingQueue = queue.filter((card) => card !== finishedCard);
  const decremented = relearns.map((relearn) => ({
    ...relearn,
    dueAfterCards: relearn.dueAfterCards - 1
  }));
  const readyRelearns = decremented.filter((relearn) => relearn.dueAfterCards <= 0);
  const pendingRelearns = decremented.filter((relearn) => relearn.dueAfterCards > 0);

  let nextQueue = [
    ...readyRelearns.map(({ dueAfterCards: _unused, ...card }) => card),
    ...remainingQueue
  ];

  if (nextQueue.length < Math.max(6, Math.floor(SESSION_SIZE / 2))) {
    const refill = buildStudyQueue({
      concepts,
      reviewStates,
      now: new Date(),
      size: SESSION_SIZE
    }).filter(
      (candidate) =>
        !nextQueue.some((card) => card.conceptId === candidate.conceptId) &&
        !pendingRelearns.some((card) => card.conceptId === candidate.conceptId)
    );
    nextQueue = [...nextQueue, ...refill].slice(0, SESSION_SIZE);
  }

  return {
    queue: nextQueue,
    relearns: pendingRelearns
  };
}

export function useMasteryApp() {
  const [runtimeIndex, setRuntimeIndex] = useState<RuntimeIndex | null>(null);
  const [concepts, setConcepts] = useState<Record<string, ConceptDetail>>({});
  const [reviewStates, setReviewStates] = useState<Record<string, ReviewState>>({});
  const [queue, setQueue] = useState<SessionCard[]>([]);
  const [relearnQueue, setRelearnQueue] = useState<RelearnCard[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<PyodideClient | null>(null);

  useEffect(() => {
    pyodideRef.current = new PyodideClient();
    return () => {
      pyodideRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const index = await loadRuntimeIndex();
        const [conceptMap, storedReviewStates] = await Promise.all([
          loadAllConceptDetails(index.concepts.map((concept) => concept.id)),
          listReviewStates()
        ]);

        if (cancelled) {
          return;
        }

        const reviewStateMap = keyByConcept(storedReviewStates);
        setRuntimeIndex(index);
        setConcepts(conceptMap);
        setReviewStates(reviewStateMap);
        setQueue(
          buildStudyQueue({
            concepts: conceptMap,
            reviewStates: reviewStateMap,
            now: new Date(),
            size: SESSION_SIZE
          })
        );
        setSelectedConceptId(index.concepts[0]?.id ?? null);
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load app data.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentCard = queue[0] ?? null;
  const currentConcept = currentCard ? concepts[currentCard.conceptId] : null;
  const currentItem =
    currentCard && currentConcept
      ? currentConcept.items.find((item) => item.id === currentCard.itemId) ?? null
      : null;

  const stats = useMemo(() => {
    const conceptList = Object.values(concepts);
    const now = Date.now();
    const dueCount = Object.values(reviewStates).filter(
      (reviewState) => new Date(reviewState.dueAt).getTime() <= now
    ).length;
    const masteredCount = conceptList.filter((concept) => {
      const state = reviewStates[concept.id];
      return Boolean(state && state.successfulReviews >= concept.masteryThreshold);
    }).length;
    const newCount = conceptList.filter((concept) => !reviewStates[concept.id]).length;
    const weakCount = Object.values(reviewStates).filter((state) => state.lapses > 0).length;

    return {
      conceptCount: conceptList.length,
      dueCount,
      masteredCount,
      newCount,
      weakCount
    };
  }, [concepts, reviewStates]);

  const refreshQueue = () => {
    setQueue(
      buildStudyQueue({
        concepts,
        reviewStates,
        now: new Date(),
        size: SESSION_SIZE
      })
    );
    setRelearnQueue([]);
  };

  const focusConcept = (conceptId: string) => {
    const concept = concepts[conceptId];
    if (!concept) {
      return;
    }

    setSelectedConceptId(conceptId);
    const reviewState = reviewStates[conceptId];
    const focusedCard = nextCardForConcept(concept, reviewState, reviewState ? "weak" : "fresh");
    setQueue((currentQueue) => {
      const withoutConcept = currentQueue.filter((card) => card.conceptId !== conceptId);
      return [focusedCard, ...withoutConcept];
    });
  };

  const recordOutcome = async (outcome: StudyResult) => {
    if (!currentCard || !currentConcept) {
      return;
    }

    const existingState =
      reviewStates[currentConcept.id] ?? getDefaultReviewState(currentConcept.id, new Date());
    const updatedState = applyReviewOutcome(existingState, outcome, new Date());
    const nextReviewStates = {
      ...reviewStates,
      [currentConcept.id]: updatedState
    };
    const nextRelearns =
      outcome === "incorrect"
        ? [
            ...relearnQueue,
            {
              ...currentCard,
              source: "relearn" as const,
              dueAfterCards: SAME_SESSION_OFFSET
            }
          ]
        : relearnQueue;
    const advanced = advanceSession({
      queue,
      relearns: nextRelearns,
      finishedCard: currentCard,
      concepts,
      reviewStates: nextReviewStates
    });

    setReviewStates(nextReviewStates);
    setQueue(advanced.queue);
    setRelearnQueue(advanced.relearns);
    await saveReviewState(updatedState);
  };

  const exportProgress = async () => {
    if (!runtimeIndex) {
      return;
    }

    const payload = await exportReviewStates(runtimeIndex.generatedAt);
    downloadJson("practice-testing-ds-progress.json", payload);
  };

  const importProgress = async (file: File) => {
    const payload = await readImportFile(file);
    await replaceReviewStates(payload.reviewStates);
    const mapped = keyByConcept(payload.reviewStates);
    setReviewStates(mapped);
    setQueue(
      buildStudyQueue({
        concepts,
        reviewStates: mapped,
        now: new Date(),
        size: SESSION_SIZE
      })
    );
    setRelearnQueue([]);
  };

  return {
    concepts,
    currentCard,
    currentConcept,
    currentItem,
    error,
    exportProgress,
    focusConcept,
    importProgress,
    loading,
    pyodideClient: pyodideRef.current,
    queue,
    recordOutcome,
    refreshQueue,
    reviewStates,
    runtimeIndex,
    selectedConceptId,
    setSelectedConceptId,
    stats
  };
}
