import fs from "node:fs/promises";
import path from "node:path";

const vendoredRoot = path.resolve("vendor/pyodide");
const fallbackRoot = path.resolve("node_modules/pyodide");
const outputRoot = path.resolve("public/pyodide");

const REQUIRED_FILES = new Set([
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "pyodide.mjs",
  "pyodide.mjs.map",
  "pyodide.js",
  "pyodide.js.map",
  "pyodide-lock.json",
  "python_stdlib.zip"
]);

const REQUIRED_PACKAGE_PREFIXES = [
  "numpy-",
  "pandas-",
  "matplotlib-",
  "scikit_learn-",
  "scipy-",
  "joblib-",
  "threadpoolctl-",
  "python_dateutil-",
  "pytz-",
  "tzdata-",
  "cycler-",
  "contourpy-",
  "fonttools-",
  "kiwisolver-",
  "packaging-",
  "pillow-",
  "pyparsing-",
  "six-"
];

async function ensureDir(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function copyMatchingFiles(sourceRoot, targetRoot) {
  await fs.rm(targetRoot, { recursive: true, force: true });
  await ensureDir(targetRoot);
  const entries = await fs.readdir(sourceRoot, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const shouldCopy =
      REQUIRED_FILES.has(entry.name) ||
      (entry.name.endsWith(".whl") &&
        REQUIRED_PACKAGE_PREFIXES.some((prefix) => entry.name.startsWith(prefix)));

    if (!shouldCopy) {
      continue;
    }

    await fs.copyFile(
      path.join(sourceRoot, entry.name),
      path.join(targetRoot, entry.name)
    );
  }
}

async function main() {
  const sourceRoot = await fs
    .stat(vendoredRoot)
    .then(() => vendoredRoot)
    .catch(() => fallbackRoot);

  await copyMatchingFiles(sourceRoot, outputRoot);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
