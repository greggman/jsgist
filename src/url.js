export function updateURL(params) {
  const searchParams = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
  }
  const url = new URL(window.location.href);
  url.search = searchParams.toString();
  window.history.replaceState({}, '', url.href);
}
