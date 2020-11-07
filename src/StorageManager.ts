import SubscriptionManager from './SubscriptionManager';

export default class StorageManager {
  prefix: string;
  subscriptionManager: SubscriptionManager;

  constructor(prefix: string) {
    this.prefix = `${prefix}-`;
    this.subscriptionManager = new SubscriptionManager();
    window.addEventListener('storage', this._handleNewValue);
  }
  private _handleNewValue = (e: StorageEvent) => {
    const key = e.key;
    if (key && key.startsWith(this.prefix)) {
      const unPrefixedKey = key.substr(this.prefix.length);
      this.subscriptionManager.notify(unPrefixedKey);
    }
  }
  private _addPrefix(key: string): string {
    return `${this.prefix}${key}`;
  }
  subscribe(key: string, fn: () => void): void {
    this.subscriptionManager.subscribe(key, fn);
  }
  unsubscribe(key: string, fn: () => void): void {
    this.subscriptionManager.unsubscribe(key, fn);
  }
  get(key: string, session = false) {
    const k = this._addPrefix(key);
    if (session) {
      const v = sessionStorage.getItem(k);
      if (v) {
        return v;
      }
    }
    return localStorage.getItem(k);
  }
  set(key: string, value: string, session = false) {
    const k = this._addPrefix(key);
    if (session) {
      sessionStorage.setItem(k, value);
    }
    localStorage.setItem(k, value);
    this.subscriptionManager.notify(key);
  }
  delete(key: string, session = false) {
    const k = this._addPrefix(key);
    if (session) {
      sessionStorage.removeItem(k);
    }
    localStorage.removeItem(k);
    this.subscriptionManager.notify(key);
  }
  cleanup() {
    window.removeEventListener('storage', this._handleNewValue);
  }
}
