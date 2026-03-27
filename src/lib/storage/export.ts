import type { ReviewExportPayload } from "../types";

export function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function readImportFile(file: File): Promise<ReviewExportPayload> {
  const text = await file.text();
  return JSON.parse(text) as ReviewExportPayload;
}
