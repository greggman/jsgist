import {storageManager} from '../globals.js';
import * as model from './model.js';
import query from '../libs/start-query.js';

const settingsKey = 'ui-settings';

// This sucks but Monaco doesn't work on mobile
const canMonaco = !query.codeMirror && !(/webOS|iPhone|iPad|Android/.test(navigator.userAgent));

let initialized = false;
let settings;

const defaultSettings = {
  layout: (window.screen.width < 540 || window.screen.height < 540) ? 3 : 0,
  editor: canMonaco ? 'monaco' : 'codemirror',
  lineNumbers: true,
  tabs: false,
  showWhitespace: false,
}

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
    settings = {...defaultSettings};
  }
  for (const [key, value] of Object.entries(defaultSettings)) {
    if (typeof value !== typeof settings[key]) {
      settings[key] = value;
    }
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
