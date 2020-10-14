import {getOrFind} from '../utils.js';

async function main() {
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

  const escapeHTML = s => s.replace(/</g, '&lt;');

  const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
  // TODO, handle other forms
  const req = await fetch(`https://api.github.com/gists/${params.src}`);
  const gist = await req.json();
  const data = getGistContent(gist);
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

