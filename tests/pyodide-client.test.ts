import { beforeEach, describe, expect, it, vi } from "vitest";
import { PyodideClient } from "../src/lib/pyodide/client";

class MockWorker {
  private listener: ((event: MessageEvent) => void) | null = null;

  addEventListener(_type: string, listener: (event: MessageEvent) => void) {
    this.listener = listener;
  }

  postMessage(payload: { id: number }) {
    queueMicrotask(() => {
      this.listener?.(
        new MessageEvent("message", {
          data: {
            id: payload.id,
            result: { passed: true, message: "ok" }
          }
        })
      );
    });
  }

  terminate() {}
}

describe("PyodideClient", () => {
  beforeEach(() => {
    vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker);
  });

  it("resolves worker responses", async () => {
    const client = new PyodideClient();
    const result = await client.run({
      script: "print('hello')"
    });

    expect(result.passed).toBe(true);
    expect(result.message).toBe("ok");
  });
});
