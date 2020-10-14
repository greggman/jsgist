import {getOrFind} from '../utils.js';
import {createURL} from '../url.js';
import {loadGistFromSrc} from '../loader.js';

async function main() {
  const escapeHTML = s => s.replace(/</g, '&lt;');

  const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
  const {data} = await loadGistFromSrc(params.src);
  const a = document.querySelector('.head a');
  a.textContent = `jsGist - ${data.name}`;
  a.href = createURL(window.location.origin, {src: params.src});
  if (params.noheader) {
    document.querySelector('.head').style.display = 'none';
  }

  const files = data.files;
  const mainHTML = getOrFind(files, 'index.html', 'html');
  const mainJS = getOrFind(files, 'index.js', 'js', 'js', 'javascript');
  const mainCSS = getOrFind(files, 'index.css', 'css');
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHTML(data.name)}</title>
    <style>
    ${mainCSS.content}
    </style>
  </head>
  <body>
  ${mainHTML.content}
  </body>
  <${'script'} type="module">
  ${mainJS.content}
  </${'script'}>
</html>
  `;
  const blob = new Blob([html], {type: 'text/html'});
  const iframe = document.querySelector('iframe');
  iframe.src = URL.createObjectURL(blob);
}

main();

