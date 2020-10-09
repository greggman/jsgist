// in separate script tag so we get error from other script's
// syntax errors
window.addEventListener('error', (e) => {
  const data = {
    ...(e.message && e.message),
    ...(e.lineno && e.lineno),
    ...(e.colno && e.colno),
  }
  window.parent.postMessage({type: 'error', data}, "*");
});
