import { Octokit } from '@octokit/rest';

const userAgent = 'jsGist v0.0.1';

function getGistContent(gist) {
  const data = JSON.parse(gist.files['jsGist.json'].content);
  data.files = Object.entries(gist.files)
    .filter(([name]) => name !== 'jsGist.json')
    .map(([name, file]) => {
      return {
        name,
        content: file.content,
      }
    }).concat(data.files || []);
  return data;
} 

function createGistData(data, gist_id) {
  let files = data.files.reduce((files, file) => {
    files[file.name] = {content: file.content};
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
  return {
    description: data.name,
    public: !data.settings.private,
    files,
    ...(gist_id && {gist_id}),
  };
}

export default class GitHub {
  constructor() {
    this.pat = '';
    this.unAuthorizedOctokit = new Octokit({
      userAgent,
    });
  }
  get octokit() {
    return this.authorizedOctokit || this.unAuthorizedOctokit;
  }
  setPat(pat) {
    if (pat !== this.pat) {
      this.pat = pat;
      this.authorizedOctokit = new Octokit({
        auth: pat,
        userAgent,
      });
    }
  }
  async getUserGists() {
    const gists = await this.authorizedOctokit.paginate(this.authorizedOctokit.gists.list);
    return gists.filter(gist => !!gist.files['jsGist.json']);
    // return await this.authorizedOctokit.gists.list();
  }
  async getUserGist(gist_id) {
    const gist = await this.octokit.gists.get({gist_id});
    return getGistContent(gist);
  }
  async getAnonGist(gist_id) {
    const req = await fetch(`https://api.github.com/gists/${gist_id}`);
    const gist = await req.json();
    return getGistContent(gist);
  }
  async createGist(data) {
    const gist = await this.authorizedOctokit.gists.create(createGistData(data));
    return gist.data.id;
  }
  async updateGist(gist_id, data) {
    return await this.authorizedOctokit.gists.update(createGistData(data, gist_id));
  }
}
