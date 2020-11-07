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
  /*
  {
    "login": "greggman",
    "id": 234804,
    "node_id": "MDQ6VXNlcjIzNDgwNA==",
    "avatar_url": "https://avatars2.githubusercontent.com/u/234804?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/greggman",
    "html_url": "https://github.com/greggman",
    "followers_url": "https://api.github.com/users/greggman/followers",
    "following_url": "https://api.github.com/users/greggman/following{/other_user}",
    "gists_url": "https://api.github.com/users/greggman/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/greggman/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/greggman/subscriptions",
    "organizations_url": "https://api.github.com/users/greggman/orgs",
    "repos_url": "https://api.github.com/users/greggman/repos",
    "events_url": "https://api.github.com/users/greggman/events{/privacy}",
    "received_events_url": "https://api.github.com/users/greggman/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Greggman",
    "company": null,
    "blog": "http://games.greggman.com",
    "location": "Earth",
    "email": "github@greggman.com",
    "hireable": null,
    "bio": "30 years of games\r\n5 years of Chrome",
    "twitter_username": null,
    "public_repos": 283,
    "public_gists": 80,
    "followers": 1037,
    "following": 3,
    "created_at": "2010-04-01T08:48:05Z",
    "updated_at": "2020-10-24T06:05:24Z"
  }
  */
  getUserData() {
    return this.userData;
  }
  _handleNewAuth = async() => {
    this.userData = undefined;
    const pat = this.oauthManager.pat();
    this.github.setPat(pat);
    if (pat) {
      try {
        const data = await this.github.getAuthenticatedUser();
        this.userData = data;
      } catch (e) {
        this.addError(e);
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

