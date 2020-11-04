import { Octokit } from '@octokit/rest';

const userAgent = 'jsGist v0.0.1';
const emptyValue = '/*bug-in-github-api-content-can-not-be-empty*/';

export function getGistContent(gist) {
  const data = JSON.parse(gist.files['jsGist.json'].content);
  data.files = Object.entries(gist.files)
    .filter(([name]) => name !== 'jsGist.json')
    .map(([name, file]) => {
      return {
        name,
        content: file.content.startsWith(emptyValue)
            ? file.content.substr(emptyValue.length)
            : file.content,
      }
    }).concat(data.files || []);
  return data;
} 

export async function getAnonGist(gist_id) {
  const req = await fetch(`https://api.github.com/gists/${gist_id}`);
  const gist = await req.json();
  return {
    data: getGistContent(gist),
    rawData: gist,
  };
}

export function getUserData(data) {
  return (data && data.owner)
      ? {
          name: data.owner.login,
          avatarURL: data.owner.avatar_url,
      }
      : undefined;
}

function createGistData(data, gist_id) {
  let files = data.files.reduce((files, file) => {
    files[file.name] = {
      content: file.content.trim() ? file.content : `${emptyValue}${file.content}`,
    };
    return files;
  }, {});
  const saveData = {
    ...data,
  };
  /*
  // we can't add a readme because we don't know the gist_id. I guess we would double
  // save? create then update?

  const lowerCaseFiles = Object.keys(files).map(n => n.toLowerCase());
  const hadReadme = 
      lowerCaseFiles.includes('readme.md') ||
      lowerCaseFiles.includes('readme.txt') ||
      lowerCaseFiles.includes('readme');
  if (!hadReadme) {
    files['README.md'] = `# ${data.name}\n\n[jsGist Link](${window.location.origin}?src=${})`
  }
  */
  const jsGistData = {}
  files['jsGist.json'] = jsGistData;
  const noDuplicateNames = Object.keys(files).length === data.files.length + 1;
  if (noDuplicateNames) {
    delete saveData.files;
  } else {
    // save the files in the json
    files = {
      'jsGist.json': jsGistData,
    };
  }
  jsGistData.content = JSON.stringify(saveData);
  if (gist_id) {
    // if we have a gist_id this is an update
    // updates need filenames (which allows renaming)
    for (const [filename, file] of Object.entries(files)) {
      file.filename = filename;
    }
  }
  return {
    files,
    description: data.name,
    ...(!gist_id && {public: !data.settings.private}),
    ...(gist_id && {gist_id}),
  };
}

export default class GitHub extends EventTarget {
  constructor() {
    super();
    this.pat = '';
    this.user = {};
    this.unAuthorizedOctokit = new Octokit({
      userAgent,
    });
  }
  get octokit() {
    return this.authorizedOctokit || this.unAuthorizedOctokit;
  }
  // TODO: this does not belong here!
  _updateUserData(data) {
    const userData = getUserData(data);
    if (userData) {
      Object.assign(this.user, userData);
      const event = new Event('userdata');
      event.data = {...this.user};
      this.dispatchEvent(event);
    }
  }
  setPat(pat) {
    if (pat !== this.pat) {
      this.pat = pat;
      if (pat) {
        this.authorizedOctokit = new Octokit({
          auth: pat,
          userAgent,
        });
      } else {
        this.authorizedOctokit = undefined;
      }
    }
  }
  /*
  "{
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
    "public_gists": 79,
    "followers": 1037,
    "following": 3,
    "created_at": "2010-04-01T08:48:05Z",
    "updated_at": "2020-10-24T06:05:24Z"
  }"
  */
  async getAuthenticatedUser() {
    const response = await this.authorizedOctokit.users.getAuthenticated();
    if (response.status !== 200) {
      throw new Error(response.message);
    }
    return response.data;
  }

  async getUserGists() {
    const gists = await this.authorizedOctokit.paginate(this.authorizedOctokit.gists.list);
    return gists.filter(gist => !!gist.files['jsGist.json']);
    // return await this.authorizedOctokit.gists.list();
  }

  async getAnonGist(gist_id) {
    const {data, rawData} = await getAnonGist(gist_id);
    this._updateUserData(rawData);
    return {data, rawData};
  }

  async getUserGist(gist_id) {
    const gist = await this.octokit.gists.get({gist_id});
    this._updateUserData(gist.data);
    return getGistContent(gist.data);
  }

  async createGist(data) {
    const gistData = createGistData(data);
    const gist = await this.authorizedOctokit.gists.create(gistData);
    this._updateUserData(gist.data);
    return {
      id: gist.data.id,
      name: gist.data.description,
      date: gist.data.updated_at,
    };
  }
  async updateGist(gist_id, data) {
    const gistData = createGistData(data, gist_id);
    const gist = await this.authorizedOctokit.gists.update(gistData);
    return {
      id: gist.data.id,
      name: gist.data.description,
      date: gist.data.updated_at,
    };
  }

  async createGistComment(gist_id, body) {
    const result = await this.authorizedOctokit.gists.createComment({
      gist_id,
      body,
    });
    if (result.status < 200 || result.status >= 300) {
      throw new Error(result.message);
    }
    return result.data;
  }
}

