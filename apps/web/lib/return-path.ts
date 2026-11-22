export function getReturnPath(fallback: string) {
  const params = new URLSearchParams(window.location.search);
  const path = params.get("next");
  if (path?.startsWith("/") && !path.startsWith("//")) {
    const url = new URL(path, window.location.origin);
    if (url.origin === window.location.origin) return url.pathname + url.search + url.hash;
  }
  return params.get("reading") === "1" ? "/ielts/reading/" : fallback;
}
