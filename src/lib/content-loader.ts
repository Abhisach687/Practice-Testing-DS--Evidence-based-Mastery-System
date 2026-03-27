import type { ConceptDetail, RuntimeIndex } from "./types";
import { withBasePath } from "./base-url";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}`);
  }

  return (await response.json()) as T;
}

export async function loadRuntimeIndex(): Promise<RuntimeIndex> {
  return fetchJson<RuntimeIndex>(withBasePath("data/runtime-index.json"));
}

export async function loadConceptDetail(conceptId: string): Promise<ConceptDetail> {
  return fetchJson<ConceptDetail>(withBasePath(`data/concepts/${conceptId}.json`));
}

export async function loadAllConceptDetails(
  conceptIds: string[]
): Promise<Record<string, ConceptDetail>> {
  const details = await Promise.all(
    conceptIds.map(async (conceptId) => [conceptId, await loadConceptDetail(conceptId)] as const)
  );

  return Object.fromEntries(details);
}
