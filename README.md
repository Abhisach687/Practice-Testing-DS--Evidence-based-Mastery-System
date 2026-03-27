# Practice Testing DS

Local-first Python and data science practice app built from four source books, with:

- retrieval-first study flow: `attempt -> hint -> solution -> follow-up review`
- GregMat-style mountain scheduling with spaced resurfacing
- offline Pyodide coding exercises in the browser
- chapter extraction and coverage validation against the source PDFs
- small stitched content files so the curriculum stays maintainable

## Stack

- `Vite + React + TypeScript`
- `IndexedDB` via `idb` for local progress
- `Pyodide 0.29.3` in a dedicated worker
- `pdfjs-dist` for PDF outline/text extraction
- `Vitest` and `Playwright` for verification

## Project Layout

- `src/`: app UI, scheduler, storage, and Pyodide client
- `content/source/`: authored concept packs and book metadata
- `scripts/`: content compiler, PDF extractor, and Pyodide sync scripts
- `public/data/`: compiled runtime curriculum shards
- `public/pyodide/`: deployable offline Pyodide runtime assets
- `generated/extracted/`: local PDF chapter extraction output

## Local Development

Install dependencies:

```powershell
npm install
```

Build the curriculum data:

```powershell
npm run build:content
```

Extract chapter shards from the local PDFs:

```powershell
npm run extract:books
```

Refresh local Pyodide assets:

```powershell
npm run sync:pyodide
```

Run the app:

```powershell
npm run dev
```

## Tests

Unit tests:

```powershell
npm test
```

Browser smoke test:

```powershell
npm run test:e2e
```

Production build:

```powershell
npm run build
```

## Offline Pyodide Notes

The deployable browser runtime lives in `public/pyodide/`.

The large `vendor/` folder is only a local cache for syncing the full Pyodide distribution and is intentionally ignored by git. If you already have the required files inside `public/pyodide/`, the app can still be built and deployed without checking `vendor/` into the repository.

## Source PDFs

The extractor currently expects the same local PDF paths used during implementation. If your PDFs live elsewhere, update the entries in `content/source/books/*.mjs` before running:

```powershell
npm run extract:books
```

## Deploy To GitHub Pages

This app is static, so GitHub Pages can host it directly from the built `dist/` folder.

### 1. Build with the correct base path

If you are deploying to a project site like:

`https://<username>.github.io/<repo-name>/`

build with `BASE_PATH` set to `/<repo-name>/`.

PowerShell:

```powershell
$env:BASE_PATH = "/<repo-name>/"
npm run build
Remove-Item Env:BASE_PATH
```

Bash:

```bash
BASE_PATH="/<repo-name>/" npm run build
```

If you are deploying at the domain root, just run:

```powershell
npm run build
```

### 2. Publish the `dist/` folder

This repo already includes:

`./.github/workflows/deploy-pages.yml`

That workflow builds the app and deploys `dist/` to GitHub Pages automatically on every push to `main`.

Then:

1. Push the repository to GitHub.
2. Open `Settings -> Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main` to trigger the workflow.

Important:

- The included workflow assumes a project site and uses `/${{ github.event.repository.name }}/` as `BASE_PATH`.
- If you are deploying to a user or organization root site instead of a project site, edit `.github/workflows/deploy-pages.yml` and change `BASE_PATH` to `/`.

If you prefer a manual branch-based deployment instead, the same rule still applies: build first with the correct `BASE_PATH`, then publish the contents of `dist/`.

## GitHub Pages Walkthrough

If you want the shortest path:

1. Create a GitHub repository and push this project to `main`.
2. Open the repo on GitHub.
3. Go to `Settings -> Pages`.
4. Under `Build and deployment`, choose `GitHub Actions`.
5. Make sure `.github/workflows/deploy-pages.yml` is in the repo.
6. Push a commit to `main`.
7. Open the `Actions` tab and wait for `Deploy GitHub Pages` to finish.
8. After it succeeds, GitHub will show the site URL on the Pages settings screen and in the workflow summary.

If the site opens with missing assets, the usual cause is a mismatched base path:

- project page: keep `BASE_PATH` as `/${repo-name}/`
- root domain page: change `BASE_PATH` to `/`

## Notes

- The app currently uses one unified concept graph across all four books.
- `public/data/coverage-report.json` is generated from the real book outlines and fails the build if required chapter coverage goes missing.
- Pyodide exercises are intentionally used only where execution adds value; many review items stay as flashcards, MCQs, tracing, and short-answer retrieval.
