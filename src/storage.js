import SubscriptionManager from './subscription-manager.js';

export default class StorageManager {
  constructor(prefix) {
    this.prefix = `${prefix}-`;
    this.subscriptionManager = new SubscriptionManager();
    window.addEventListener('storage', this._handleNewValue);
  }
  _handleNewValue = (e) => {
    const key = e.key;
    if (key.startsWith(this.prefix)) {
      const unPrefixedKey = key.substr(this.prefix.length);
      this.subscriptionManager.notify(unPrefixedKey);
    }
  }
  _addPrefix(key) {
    return `${this.prefix}${key}`;
  }
  subscribe(key, fn) {
    this.subscriptionManager.subscribe(key, fn);
  }
  unsubscribe(key, fn) {
    this.subscriptionManager.unsubscribe(key, fn);
  }
  get(key, session = false) {
    const k = this._addPrefix(key);
    if (session) {
      const v = sessionStorage.getItem(k);
      if (v) {
        return v;
      }
    }
    return localStorage.getItem(k);
  }
  set(key, value, session = false) {
    const k = this._addPrefix(key);
    if (session) {
      sessionStorage.setItem(k, value);
    }
    localStorage.setItem(k, value);
    this.subscriptionManager.notify(key);
  }
  delete(key, session) {
    const k = this._addPrefix(key);
    if (session) {
      sessionStorage.removeItem(k);
    }
    localStorage.removeItem(k);
  }
  cleanup() {
    window.removeEventListener('storage', this._handleNewValue);
  }
}

