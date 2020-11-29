import Ajv from 'ajv';
import * as model from './model.js';
import {storageManager} from '../globals.js';
const gistsKey = 'gists';

const gistSchema = {
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "date": { "type": "string" },
  },
  "required": ["name", "date"],
};

const gistsSchema = {
  "$schema": "http://json-schema.org/schema#",
  "type": "object",
  "additionalProperties": gistSchema,
};
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const gistsValidator = ajv.compile(gistsSchema);
const gistValidator = ajv.compile(gistSchema);

function getStoredGists() {
  try {
    const gists = JSON.parse(storageManager.get(gistsKey));
    if (!gistsValidator(gists)) {
      storageManager.delete(gistsKey);
      throw new Error();
    }
    return gists;
  } catch(e) {
    return {};
  }
}

model.add('gists', getStoredGists());

// does this need to be centralized?
storageManager.subscribe(gistsKey, () => {
  model.set('gists', getStoredGists());
});

export function addGist(id, name, date, _public) {
  const gist = {name, date, public: _public};
  if (!gistValidator(gist)) {
    throw new Error(`gist not valid:\n${gistValidator.errors.map(e => `${e.message}: ${e.dataPath}`)}`)
  }
  const gists = {...model.get('gists')};
  gists[id] = gist;
  model.set('gists', gists);
  saveGistsToLocalStorage(gists);
}

export function removeGist(id) {
  const gists = {...model.get('gists')};
  delete gists[id];
  model.set('gists', gists);
  saveGistsToLocalStorage(gists);
}

function saveGistsToLocalStorage(gists) {
  // send to other windows
  storageManager.set(gistsKey, JSON.stringify(gists));
}

export function getGists() {
  return model.get('gists');
}

export function setGists(gists) {
  if (!gistsValidator(gists)) {
    throw new Error(`gists not valid:\n${gistValidator.errors.map(e => `${e.message}: ${e.dataPath}`)}`)
  }
  model.set('gists', gists);
  saveGistsToLocalStorage(gists);
}

export function subscribe(fn) {
  model.subscribe('gists', fn);
}

export function unsubscribe(fn) {
  model.unsubscribe('gists', fn);
}
