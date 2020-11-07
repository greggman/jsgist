
import {clientId} from '../globals.js';
import {createURL} from './url.js';
import {createPopup} from './utils';
import StorageManager from './StorageManager';
import * as winMsgMgr from './WindowMessageManager';

const patKey = 'pat';

const getTokenURL = 'https://auth.jsgist.org/oauth-helper'
export default class OAuthManager {
  private _popup?: Window;
  private _state?: string;
  private _storageManager: StorageManager;

  constructor(storageManager: StorageManager) {
    this._popup = undefined;
    this._state = undefined;  // last state sent to auth
    this._storageManager = storageManager;
    winMsgMgr.on('auth', null, (data: any) => {
      this._closePopup();
      if (data.state === this._state) {
        this.requestToken(data);
      }
    });
  }
  // TODO: rename this and decide if Github should be connected
  pat() {
    return this._storageManager.get(patKey);
  }
  subscribe(fn: () => void) {
    this._storageManager.subscribe(patKey, fn);
  }
  unsubscribe(fn: () => void) {
    this._storageManager.unsubscribe(patKey, fn);
  }
  _closePopup() {
    if (this._popup) {
      this._popup.close();
      this._popup = undefined;
    }
  }
  requestToken = async (auth: any) => {
    try {
      const params = {
        client: clientId,
        code: auth.code,
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
    this._state = `${Date.now()}-${Math.random()}`;  // does this need to special? Seems like no
    const url = createURL('https://github.com/login/oauth/authorize', {
      client_id: clientId,
      scope: 'gist',
      state: this._state,
    });
    this._popup = createPopup(url);
  }
}