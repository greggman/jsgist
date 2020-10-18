const handlers = {};

export function on(type, fn) {
  let fns = handlers[type];
  if (!fns) {
    fns = [];
    handlers[type] = fns;
  }
  remove(type, fn);
  fns.push(fn);
}

export function remove(type, fn) {
  const fns = handlers[type];
  if (fns) {
    const ndx = fns.indexOf(fn);
    if (ndx >= 0) {
      fns.splice(ndx, 1);
    }
  }
}

window.addEventListener('message', (e) => {
  const {type, data} = e.data;
  const fns = handlers[type];
  if (fns) {
    for (const fn of fns) {
      fn(data);
    }
  }
});

