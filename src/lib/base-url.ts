const rawBaseUrl = import.meta.env.BASE_URL;

export function withBasePath(relativePath: string) {
  const normalized = relativePath.replace(/^\/+/, "");
  return `${rawBaseUrl}${normalized}`;
}
