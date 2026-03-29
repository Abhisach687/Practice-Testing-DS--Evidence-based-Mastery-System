const rawBaseUrl = import.meta.env.BASE_URL;
const normalizedBaseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;

export function withBasePath(relativePath: string) {
  const normalized = relativePath.replace(/^\/+/, "");
  return `${normalizedBaseUrl}${normalized}`;
}
