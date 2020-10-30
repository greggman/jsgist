import {storageManager} from './globals.js';
import * as model from './model.js';

const settingsKey = 'ui-settings';

let initialized = false;
let settings;

function init() {
  if (initialized) {
    return;
  }
  initialized = true;
  try {
    settings = JSON.parse(storageManager.get(settingsKey, true));
    if (!settings) {
      throw new Error('no settings');
    }
  } catch (e) {
    settings = {
      layout: (window.screen.width < 540 || window.screen.height << 540) ? 3 : 0,
    };
  }
}

model.add('settings', settings);

export function set(name, value) {
  settings[name] = value;
  const json = JSON.stringify(settings);
  storageManager.set(settingsKey, json, true);
  model.set('settings', settings);
}

export function get() {
  init();
  return settings;
}

export function subscribe(fn) {
  model.subscribe('settings', fn);
}

export function unsubscribe(fn) {
  model.unsubscribe('settings', fn);
}
