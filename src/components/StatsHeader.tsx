import type { RuntimeIndex } from "../lib/types";

interface StatsHeaderProps {
  runtimeIndex: RuntimeIndex;
  stats: {
    conceptCount: number;
    dueCount: number;
    masteredCount: number;
    newCount: number;
    weakCount: number;
  };
  onRefreshQueue: () => void;
  onExportProgress: () => void;
  onImportProgress: (file: File) => void;
}

export function StatsHeader({
  runtimeIndex,
  stats,
  onRefreshQueue,
  onExportProgress,
  onImportProgress
}: StatsHeaderProps) {
  return (
    <header className="hero-card">
      <div className="hero-copy">
        <p className="eyebrow">Evidence-based mastery system</p>
        <h1>Practice Testing DS</h1>
        <p className="hero-text">
          Retrieval first, hints second, solutions last, then spaced resurfacing
          on a mountain-style review curve. Built from all four books and stored
          locally.
        </p>
        <div className="action-row">
          <button type="button" className="primary-button" onClick={onRefreshQueue}>
            Build today&apos;s queue
          </button>
          <button type="button" className="secondary-button" onClick={onExportProgress}>
            Export progress
          </button>
          <label className="secondary-button upload-button">
            Import progress
            <input
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void onImportProgress(file);
                }
                event.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      </div>
      <div className="hero-stats">
        <div className="stat-pill">
          <span>Concepts</span>
          <strong>{stats.conceptCount}</strong>
        </div>
        <div className="stat-pill">
          <span>Due now</span>
          <strong>{stats.dueCount}</strong>
        </div>
        <div className="stat-pill">
          <span>New</span>
          <strong>{stats.newCount}</strong>
        </div>
        <div className="stat-pill">
          <span>Weak spots</span>
          <strong>{stats.weakCount}</strong>
        </div>
        <div className="stat-pill">
          <span>Mastered</span>
          <strong>{stats.masteredCount}</strong>
        </div>
        <div className="stat-pill">
          <span>Books</span>
          <strong>{runtimeIndex.books.length}</strong>
        </div>
      </div>
    </header>
  );
}
