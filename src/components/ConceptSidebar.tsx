import type { ConceptDetail, ReviewState, RuntimeIndex, SessionCard } from "../lib/types";

interface ConceptSidebarProps {
  concepts: Record<string, ConceptDetail>;
  queue: SessionCard[];
  reviewStates: Record<string, ReviewState>;
  runtimeIndex: RuntimeIndex;
  selectedConceptId: string | null;
  onSelectConcept: (conceptId: string) => void;
}

function statusLabel(concept: ConceptDetail, reviewState?: ReviewState) {
  if (!reviewState) {
    return "new";
  }

  if (reviewState.successfulReviews >= concept.masteryThreshold) {
    return "mastered";
  }

  if (reviewState.lapses > 0) {
    return "fragile";
  }

  return "reviewing";
}

export function ConceptSidebar({
  concepts,
  queue,
  reviewStates,
  runtimeIndex,
  selectedConceptId,
  onSelectConcept
}: ConceptSidebarProps) {
  const conceptList = Object.values(concepts);

  return (
    <aside className="sidebar-card">
      <section>
        <h2>Mountain Queue</h2>
        <ol className="queue-list">
          {queue.slice(0, 8).map((card, index) => (
            <li key={`${card.itemId}-${index}`}>
              <span className={`queue-badge queue-${card.source}`}>{card.source}</span>
              <button type="button" onClick={() => onSelectConcept(card.conceptId)}>
                {concepts[card.conceptId]?.title ?? card.conceptId}
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>Book Coverage</h2>
        <div className="book-grid">
          {runtimeIndex.books.map((book) => (
            <article key={book.bookId} className="book-card">
              <h3>{book.shortTitle}</h3>
              <p>
                {book.coveredChapterCount}/{book.chapterCount} key chapters mapped
              </p>
              <small>
                {book.extraction.available ? "Chapter shards extracted" : "Extraction pending"}
              </small>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Concept Map</h2>
        <div className="concept-list">
          {conceptList.map((concept) => {
            const state = reviewStates[concept.id];
            const active = selectedConceptId === concept.id;
            return (
              <button
                key={concept.id}
                type="button"
                className={`concept-chip ${active ? "active" : ""}`}
                onClick={() => onSelectConcept(concept.id)}
              >
                <span>{concept.title}</span>
                <strong>{statusLabel(concept, state)}</strong>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
