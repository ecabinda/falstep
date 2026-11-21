export function getAssetPath(path) {
  if (!path || typeof path !== "string") return path;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;

  // Prevent duplicate base path prepending
  if (cleanBase && (path === cleanBase || path.startsWith(`${cleanBase}/`))) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
