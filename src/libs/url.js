export function createURL(base, params) {
  const url = new URL(base);
  const searchParams = new URLSearchParams(url.search);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
  }
  url.search = searchParams.toString();
  return url.href;
}

export function updateURL(params) {
  const url = createURL(window.location.href, params);
  window.history.replaceState({}, '', url.href);
}

