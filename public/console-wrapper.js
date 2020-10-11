// in separate script tag so we get error from other script's
// syntax errors
window.addEventListener('error', (e) => {
  console.error(e);
  const data = {
    ...(e.message && {message: e.message}),
    ...(e.filename && {filename: e.filename}),
    ...(e.lineno && {lineno: e.lineno}),
    ...(e.colno && {colno: e.colno}),
  }
  window.parent.postMessage({type: 'uncaughtError', data}, "*");
});
