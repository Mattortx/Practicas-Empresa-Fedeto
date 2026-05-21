const configuredApiBase = import.meta.env.VITE_API_URL?.trim() ?? "";

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!configuredApiBase) {
    return normalizedPath;
  }

  return `${configuredApiBase.replace(/\/+$/, "")}${normalizedPath}`;
}
