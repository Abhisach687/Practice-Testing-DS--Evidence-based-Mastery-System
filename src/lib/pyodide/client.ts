import type { PyodideExecutionResult, PyodideJob } from "../types";
import { withBasePath } from "../base-url";

interface PendingRequest {
  resolve: (value: PyodideExecutionResult) => void;
  reject: (reason?: unknown) => void;
  timer: number;
}

type WorkerResponse = {
  id: number;
  result?: PyodideExecutionResult;
  error?: string;
};

export class PyodideClient {
  private worker: Worker;
  private nextId = 1;
  private pending = new Map<number, PendingRequest>();

  constructor() {
    this.worker = this.createWorker();
  }

  private createWorker() {
    const worker = new Worker(withBasePath("workers/pyodide-worker.js"));

    worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
      const pending = this.pending.get(event.data.id);
      if (!pending) {
        return;
      }

      window.clearTimeout(pending.timer);
      this.pending.delete(event.data.id);

      if (event.data.error) {
        pending.reject(new Error(event.data.error));
        return;
      }

      pending.resolve(
        event.data.result ?? {
          passed: false,
          message: "Pyodide returned no result."
        }
      );
    });

    return worker;
  }

  private resetWorker() {
    this.worker.terminate();
    this.worker = this.createWorker();
  }

  async run(job: PyodideJob): Promise<PyodideExecutionResult> {
    const id = this.nextId++;

    return new Promise<PyodideExecutionResult>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        this.pending.delete(id);
        this.resetWorker();
        resolve({
          passed: false,
          message:
            "Execution timed out. The worker was reset so you can try again with a smaller step."
        });
      }, job.timeoutMs ?? 12000);

      this.pending.set(id, { resolve, reject, timer });
      this.worker.postMessage({ id, job });
    });
  }

  dispose() {
    this.worker.terminate();
    this.pending.clear();
  }
}
