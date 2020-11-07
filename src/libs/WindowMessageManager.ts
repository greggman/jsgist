type Handler = (data: any) => void;
type StringToHandlers = Map<string, Handler[]>;
const nullHandlers : StringToHandlers = new Map();
const fromToHandlersMap : Map<Window | null, StringToHandlers> = new Map([[null, nullHandlers]]);

export function on(type: string, from: Window | null, fn: (data: any) => void) {
  remove(type, from, fn);
  let handlers = fromToHandlersMap.get(from);
  if (!handlers) {
    handlers = new Map();
    fromToHandlersMap.set(from, handlers)
  }
  let fns = handlers.get(type);
  if (!fns) {
    fns = [];
    handlers.set(type, fns);
  }
  fns.push(fn);
}

export function remove(type: string, from: Window | null, fn: (data: any) => void) {
  let handlers = fromToHandlersMap.get(from);
  if (!handlers) {
    return;
  }
  const fns = handlers.get(type);
  if (fns) {
    const ndx = fns.indexOf(fn);
    if (ndx >= 0) {
      fns.splice(ndx, 1);
    }
    if (fns.length === 0) {
      handlers.delete(type);
      if (handlers.size === 0 && from) {
        fromToHandlersMap.delete(from);
      }
    }
  }
}

function callHandler(handlers: StringToHandlers, type: string, data: any) {
  const fns = handlers.get(type);
  if (fns) {
    for (const fn of fns) {
      fn(data);
    }
    return true;
  }
  return false;
}

window.addEventListener('message', (e: MessageEvent) => {
  const {type, data} = e.data;
  const handlers = fromToHandlersMap.get(e.source as Window);
  if (handlers) {
    if (callHandler(handlers, type, data)) {
      return;
    }
  }
  callHandler(nullHandlers, type, data);
});

