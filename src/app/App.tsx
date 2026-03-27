import { ConceptSidebar } from "../components/ConceptSidebar";
import { StatsHeader } from "../components/StatsHeader";
import { StudyWorkspace } from "../components/StudyWorkspace";
import { useMasteryApp } from "./useMasteryApp";

export function App() {
  const app = useMasteryApp();

  if (app.loading) {
    return <main className="shell loading-screen">Building your mastery map...</main>;
  }

  if (app.error || !app.runtimeIndex) {
    return (
      <main className="shell loading-screen">
        Failed to load the learning system. {app.error ?? "Unknown error."}
      </main>
    );
  }

  return (
    <main className="shell">
      <StatsHeader
        runtimeIndex={app.runtimeIndex}
        stats={app.stats}
        onRefreshQueue={app.refreshQueue}
        onExportProgress={() => void app.exportProgress()}
        onImportProgress={(file) => app.importProgress(file)}
      />

      <div className="layout">
        <ConceptSidebar
          concepts={app.concepts}
          queue={app.queue}
          reviewStates={app.reviewStates}
          runtimeIndex={app.runtimeIndex}
          selectedConceptId={app.selectedConceptId}
          onSelectConcept={app.focusConcept}
        />
        <StudyWorkspace
          concept={app.currentConcept}
          item={app.currentItem}
          reviewState={app.currentConcept ? app.reviewStates[app.currentConcept.id] : undefined}
          pyodideClient={app.pyodideClient}
          onRecordOutcome={app.recordOutcome}
        />
      </div>
    </main>
  );
}
