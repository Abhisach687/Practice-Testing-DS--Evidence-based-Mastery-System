let pyodidePromise = null;

function getBaseUrl() {
  const workerUrl = new URL(self.location.href);
  const basePath = workerUrl.pathname.replace(/workers\/pyodide-worker\.js$/, "");
  return `${workerUrl.origin}${basePath}`;
}

async function getPyodide() {
  if (!pyodidePromise) {
    const baseUrl = getBaseUrl();
    importScripts(`${baseUrl}pyodide/pyodide.js`);
    pyodidePromise = self.loadPyodide({
      indexURL: `${baseUrl}pyodide/`
    });
  }

  return pyodidePromise;
}

function buildHarness(job) {
  const escapedCode = JSON.stringify(job.script);
  const escapedTests = JSON.stringify(job.tests || "");

  return `
import json
import traceback

user_code = ${escapedCode}
test_code = ${escapedTests}
__grade_result__ = None

try:
    exec(user_code, globals())
    if test_code:
        exec(test_code, globals())
    if __grade_result__ is None:
        __grade_result__ = {"passed": True, "message": "Python code executed successfully."}
except AssertionError as exc:
    __grade_result__ = {"passed": False, "message": str(exc) or "An assertion failed."}
except Exception:
    __grade_result__ = {"passed": False, "message": traceback.format_exc()}

json.dumps(__grade_result__)
`;
}

self.onmessage = async (event) => {
  const { id, job } = event.data;
  const stdout = [];
  const stderr = [];

  try {
    const pyodide = await getPyodide();
    pyodide.setStdout?.({
      batched(text) {
        stdout.push(text);
      }
    });
    pyodide.setStderr?.({
      batched(text) {
        stderr.push(text);
      }
    });

    if (job.packages?.length) {
      await pyodide.loadPackage(job.packages);
    }

    const dictFactory = pyodide.globals.get("dict");
    const globals = dictFactory();
    const context = job.context || {};
    Object.entries(context).forEach(([key, value]) => {
      globals.set(key, value);
    });

    const rawResult = await pyodide.runPythonAsync(buildHarness(job), { globals });
    const parsed = JSON.parse(rawResult);
    self.postMessage({
      id,
      result: {
        ...parsed,
        stdout,
        stderr
      }
    });
  } catch (error) {
    self.postMessage({
      id,
      result: {
        passed: false,
        message: error instanceof Error ? error.message : "Unknown Pyodide worker error.",
        stdout,
        stderr
      }
    });
  }
};
