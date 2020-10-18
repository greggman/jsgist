import * as model from './model.js';

const settingsKey = 'jsgist-ui-settings';

let settings;

try {
  settings = JSON.parse(sessionStorage.getItem(settingsKey) || localStorage.getItem(settingsKey));
} catch (e) {
  settings = {
    layout: 0,
  };
}

model.add('settings', settings);

export function set(name, value) {
  settings[name] = value;
  const json = JSON.stringify(settings);
  // data our current window gets if we refresh
  sessionStorage.setItem(settingsKey, json);
  // data new windows get
  localStorage.setItem(settingsKey, json);
  model.set('settings', settings);
}

export function get() {
  return settings;
}

export function subscribe(fn) {
  model.subscribe('settings', fn);
}

export function unsubscribe(fn) {
  model.unsubscribe('settings', fn);
}
