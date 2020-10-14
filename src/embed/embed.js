import {createURL} from '../url.js';
import {loadGistFromSrc} from '../loader.js';

async function main() {
  const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
  const {data} = await loadGistFromSrc(params.src);
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
  }
  window.addEventListener('message', (e) => {
    const {type, data} =  e.data;
    const fn = handlers[type];
    if (fn) {
      fn(data);
    }
  });

  iframe.src = 'https://jsgistrunner.devcomments.org/runner.html';
}

main();

