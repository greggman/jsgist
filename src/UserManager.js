import SubscriptionManager from './subscription-manager.js';

const kUserManagerKey = 'foobar'; // not important

export default class UserManager {
  constructor({
    oauthManager,
    github,
    addError,
  }) {
    this.oauthManager = oauthManager;
    this.github = github;
    this.subscriptionManager = new SubscriptionManager();
    this.addError = addError;
    oauthManager.subscribe(this._handleNewAuth);
    this._handleNewAuth();
    this.userData = undefined;
  }
  getUserData() {
    return this.userData;
  }
  _handleNewAuth = async() => {
    const pat = this.oauthManager.pat();
    this.github.setPat(pat);
    if (pat) {
      try {
        const data = await this.github.getAuthenticatedUser();
        this.userData = data;
      } catch (e) {
        this.addError(e);
        this.userData = undefined;
      }
    }
    this.subscriptionManager.notify(kUserManagerKey);
  }
  login = () => {
    this.oauthManager.login();
  }
  logout = () => {
    this.oauthManager.logout();
  }
  subscribe(fn) {
    this.subscriptionManager.subscribe(kUserManagerKey, fn);
  }
  unsubscribe(fn) {
    this.subscriptionManager.unsubscribe(kUserManagerKey, fn);
  }
  cleanup() {
    this.oauthManager.unsubscribe(this._handleNewAuth);
  }
}

