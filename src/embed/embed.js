import {createURL} from '../libs/url.js';
import {loadGistFromSrc} from '../libs/loader.js';
import {getAnonGist, getUserData} from '../libs/GitHub.js';

async function main() {
  const github = {
    async getGist(gist_id) {
      return await getAnonGist(gist_id);
    }
  };

  const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
  const {data, rawData} = await loadGistFromSrc(params.src, github);
  const userData = getUserData(rawData);
  if (userData) {
    const userURL = `https://github.com/${userData.name}/`;
    const userElem = document.querySelector('#user');
    userElem.href = userURL;
    userElem.textContent = userData.name;
    const avatarLink = document.querySelector('#avatar-link');
    avatarLink.href = userURL;
    const avatarElem = document.querySelector('#avatar');
    avatarElem.src = userData.avatarURL;
  }
  const a = document.querySelector('.head a');
  a.textContent = `jsGist - ${data.name}`;
  a.href = createURL(window.location.origin, {src: params.src});
  if (params.noheader) {
    document.querySelector('.head').style.display = 'none';
  }

  const iframe = document.querySelector('iframe');

  const handlers = {
    gimmeDaCodez: () => {
      iframe.contentWindow.postMessage({
        type: 'run',
        data,
      }, "*");
    },
  };

  window.addEventListener('message', (e) => {
    const {type, data} =  e.data;
    const fn = handlers[type];
    if (fn) {
      fn(data);
    }
  });

  iframe.src = createURL('https://jsgistrunner.devcomments.org/runner-03.html', {url: 'https://jsgist.org/jsgist-runner.js'});
}

main();

