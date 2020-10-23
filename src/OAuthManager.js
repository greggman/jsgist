
import {clientId} from './globals.js';
import {createURL} from './url.js';
import {createPopup} from './utils.js';
import * as windowMessageManager from './window-message-manager.js';

const patKey = 'pat';

const getTokenURL = 'https://auth.jsgist.org/oauth-helper'
export default class OAuthManager {
  constructor(storageManager) {
    this._popup = undefined;
    this._state = undefined;  // last state sent to auth
    this._storageManager = storageManager;
    windowMessageManager.on('auth', (data) => {
      this._closePopup();
      if (data.state === this.state) {
        this.requestToken(data);
      }
    });
  }
  // TODO: rename this and decide if Github should be connected
  pat() {
    return this._storageManager.get(patKey);
  }
  subscribe(fn) {
    this._storageManager.subscribe(patKey, fn);
  }
  unsubscribe(fn) {
    this._storageManager.unsubscribe(patKey, fn);
  }
  _closePopup() {
    if (this.popup) {
      this.popup.close();
      this.popup = undefined;
    }
  }
  requestToken = async (auth) => {
    try {
      const params = {
        client: clientId,
        code: auth.code,
        endPoint: 'https://github.com/login/oauth/access_token',
      };
      const url = createURL(getTokenURL, params);
      const req = await fetch(url);
      const data = await req.json();
      if (!data.access_token) {
        throw new Error(JSON.stringify(data));
      }
      this._storageManager.set(patKey, data.access_token);
    } catch (e) {
      console.error(e);
    }
  }
  logout = () => {
    this._storageManager.delete(patKey);
  }
  login = () => {
    this._closePopup();
    this.state = `${Date.now()}-${Math.random()}`;  // does this need to special? Seems like no
    const url = createURL('https://github.com/login/oauth/authorize', {
      client_id: clientId,
      scope: 'gist',
      state: this.state,
    });
    this.popup = createPopup(url);
  }
}