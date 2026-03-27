import { useEffect, useMemo, useState } from "react";
import { evaluateAutoItem, itemNeedsCodeRunner } from "../lib/study/evaluate";
import type {
  ConceptDetail,
  LearningItem,
  PyodideExecutionResult,
  ReviewState,
  StudyResult
} from "../lib/types";
import type { PyodideClient } from "../lib/pyodide/client";

interface StudyWorkspaceProps {
  concept: ConceptDetail | null;
  item: LearningItem | null;
  reviewState?: ReviewState;
  pyodideClient: PyodideClient | null;
  onRecordOutcome: (outcome: StudyResult) => Promise<void>;
}

export function StudyWorkspace({
  concept,
  item,
  reviewState,
  pyodideClient,
  onRecordOutcome
}: StudyWorkspaceProps) {
  const [textAnswer, setTextAnswer] = useState("");
  const [choiceAnswer, setChoiceAnswer] = useState("");
  const [codeAnswer, setCodeAnswer] = useState("");
  const [shownHints, setShownHints] = useState(0);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [result, setResult] = useState<PyodideExecutionResult | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setTextAnswer("");
    setChoiceAnswer("");
    setCodeAnswer(item?.starterCode ?? "");
    setShownHints(0);
    setSolutionVisible(false);
    setResult(null);
    setRunning(false);
  }, [item?.id]);

  const answerValue = useMemo(() => {
    if (!item) {
      return "";
    }
    if (item.answerMode === "multiple_choice") {
      return choiceAnswer;
    }
    if (item.answerMode === "code") {
      return codeAnswer;
    }
    return textAnswer;
  }, [choiceAnswer, codeAnswer, item, textAnswer]);

  if (!concept || !item) {
    return (
      <section className="study-card empty-state">
        <h2>Queue complete</h2>
        <p>
          Generate another session to pull due reviews, weak concepts, and a few
          new ideas back into the mountain.
        </p>
      </section>
    );
  }

  const handleCheck = async () => {
    if (item.evaluationMode === "self") {
      setSolutionVisible(true);
      return;
    }

    if (itemNeedsCodeRunner(item)) {
      if (!pyodideClient) {
        setResult({
          passed: false,
          message: "Pyodide is still booting. Try again in a moment."
        });
        return;
      }

      setRunning(true);
      const executionResult = await pyodideClient.run({
        script: codeAnswer,
        packages: item.pyodide?.packages ?? [],
        tests: item.pyodide?.tests ?? "",
        timeoutMs: 15000
      });
      setResult(executionResult);
      setRunning(false);
      return;
    }

    setResult(evaluateAutoItem(item, answerValue));
  };

  const recordResult = async (baseOutcome: StudyResult) => {
    const effectiveOutcome =
      baseOutcome === "correct" && (shownHints > 0 || solutionVisible)
        ? "hinted"
        : baseOutcome;
    await onRecordOutcome(effectiveOutcome);
  };

  return (
    <section className="study-card">
      <div className="study-header">
        <div>
          <p className="eyebrow">Current concept</p>
          <h2>{concept.title}</h2>
        </div>
        <div className="study-meta">
          <span>{item.type.replaceAll("_", " ")}</span>
          <span>
            interval {reviewState?.intervalLevel ?? 0} / streak {reviewState?.streak ?? 0}
          </span>
        </div>
      </div>

      <p className="concept-summary">{concept.summary}</p>

      <article className="prompt-card">
        <h3>{item.prompt}</h3>
        {item.code ? <pre className="code-block">{item.code}</pre> : null}

        {item.answerMode === "multiple_choice" ? (
          <div className="choice-list">
            {item.choices?.map((choice) => (
              <label key={choice.id} className="choice-card">
                <input
                  type="radio"
                  name={item.id}
                  value={choice.id}
                  checked={choiceAnswer === choice.id}
                  onChange={(event) => setChoiceAnswer(event.target.value)}
                />
                <span>{choice.label}</span>
              </label>
            ))}
          </div>
        ) : null}

        {item.answerMode === "text" ? (
          <textarea
            className="answer-box"
            placeholder="Try from memory before asking for a hint."
            value={textAnswer}
            onChange={(event) => setTextAnswer(event.target.value)}
          />
        ) : null}

        {item.answerMode === "code" ? (
          <textarea
            className="answer-box code-editor"
            value={codeAnswer}
            onChange={(event) => setCodeAnswer(event.target.value)}
          />
        ) : null}

        <div className="action-row">
          <button type="button" className="primary-button" onClick={() => void handleCheck()}>
            {item.evaluationMode === "self"
              ? "Reveal solution"
              : item.evaluationMode === "pyodide"
                ? running
                  ? "Running..."
                  : "Run check"
                : "Check answer"}
          </button>
          {shownHints < item.hints.length ? (
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShownHints((count) => count + 1)}
            >
              Show hint
            </button>
          ) : null}
          <button
            type="button"
            className="secondary-button"
            onClick={() => setSolutionVisible(true)}
          >
            Show solution
          </button>
        </div>

        {shownHints > 0 ? (
          <div className="feedback-card hint-stack">
            <h4>Hints</h4>
            <ul>
              {item.hints.slice(0, shownHints).map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {result ? (
          <div className={`feedback-card ${result.passed ? "success" : "failure"}`}>
            <h4>{result.passed ? "Check passed" : "Needs another pass"}</h4>
            <p>{result.message}</p>
            {result.stdout?.length ? <pre className="terminal-block">{result.stdout.join("\n")}</pre> : null}
            {result.stderr?.length ? <pre className="terminal-block failure">{result.stderr.join("\n")}</pre> : null}
          </div>
        ) : null}

        {solutionVisible ? (
          <div className="feedback-card solution-card">
            <h4>Solution</h4>
            <p>{item.solution.summary}</p>
            {item.solution.code ? <pre className="code-block">{item.solution.code}</pre> : null}
            {item.solution.checklist?.length ? (
              <ul className="checklist">
                {item.solution.checklist.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="action-row footer-actions">
          {item.evaluationMode === "self" ? (
            <>
              <button type="button" className="primary-button" onClick={() => void recordResult("correct")}>
                I remembered it
              </button>
              <button type="button" className="secondary-button" onClick={() => void onRecordOutcome("hinted")}>
                Needed help
              </button>
              <button type="button" className="danger-button" onClick={() => void onRecordOutcome("incorrect")}>
                Missed it
              </button>
            </>
          ) : result?.passed ? (
            <button type="button" className="primary-button" onClick={() => void recordResult("correct")}>
              Continue
            </button>
          ) : result && !result.passed ? (
            <button type="button" className="danger-button" onClick={() => void onRecordOutcome("incorrect")}>
              Relearn this
            </button>
          ) : null}
        </div>
      </article>
    </section>
  );
}
