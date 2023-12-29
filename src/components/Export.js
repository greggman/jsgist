import React from 'react';

import {escapeTextForHTMLContent, getOrFind} from '../libs/utils';

const saveData = (function() {
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);
  return function saveData(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click()
  };
})();
/*

<!-- begin snippet: js hide: false console: true babel: false -->

<!-- language: lang-js -->

    console.log();

<!-- language: lang-css -->

    h1 { color: red; }

<!-- language: lang-html -->

    <h1>foo</h1>  

<!-- end snippet -->

*/

function indent4(s) {
  return s.split('\n').map(s => `    ${s}`).join('\n');
}

function makeSnippet(data, asModule) {
  const files = data.files;
  const mainHTML = getOrFind(files, 'index.html', 'html');
  const mainJS = getOrFind(files, 'index.js', 'js', 'js', 'javascript');
  const mainCSS = getOrFind(files, 'index.css', 'css');
  return asModule
    ? `
<!-- begin snippet: js hide: false console: true babel: false -->

<!-- language: lang-js -->

<!-- language: lang-css -->

${indent4(mainCSS.content)}

<!-- language: lang-html -->

${indent4(mainHTML.content)}
    <script type="module">
${indent4(mainJS.content)}
    </script>

<!-- end snippet -->
`
    : `
<!-- begin snippet: js hide: false console: true babel: false -->

<!-- language: lang-js -->

${indent4(mainJS.content)}

<!-- language: lang-css -->

${indent4(mainCSS.content)}

<!-- language: lang-html -->

${indent4(mainHTML.content)}

<!-- end snippet -->
`;

}

function openInCodepen(data) {
  const files = data.files;
  const mainHTML = getOrFind(files, 'index.html', 'html');
  const mainJS = getOrFind(files, 'index.js', 'js', 'js', 'javascript');
  const mainCSS = getOrFind(files, 'index.css', 'css');

  const pen = {
    title                 : data.name,
    description           : data.name,
    editors               : '101',
    html                  : mainHTML.content,
    css                   : mainCSS.content,
    js                    : mainJS.content,
  };

  const elem = document.createElement('div');
  elem.innerHTML = `
    <form method="POST" target="_blank" action="https://codepen.io/pen/define" class="hidden">'
      <input type="hidden" name="data">
      <input type="submit" />
    "</form>"
  `;
  elem.querySelector('input[name=data]').value = JSON.stringify(pen);
  document.body.appendChild(elem);
  elem.querySelector('form').submit();
  document.body.removeChild(elem);
}

function openInJSFiddle(data) {
  const files = data.files;
  const mainHTML = getOrFind(files, 'index.html', 'html');
  const mainJS = getOrFind(files, 'index.js', 'js', 'js', 'javascript');
  const mainCSS = getOrFind(files, 'index.css', 'css');

  const elem = document.createElement('div');
  elem.innerHTML = `
    <form method="POST" target="_black" action="https://jsfiddle.net/api/mdn/" class="hidden">
      <input type="hidden" name="html" />
      <input type="hidden" name="css" />
      <input type="hidden" name="js" />
      <input type="hidden" name="title" />
      <input type="hidden" name="wrap" value="b" />
      <input type="submit" />
    </form>
  `;
  elem.querySelector('input[name=html]').value = mainHTML.content;
  elem.querySelector('input[name=css]').value = mainCSS.content;
  elem.querySelector('input[name=js]').value = mainJS.content;
  elem.querySelector('input[name=title]').value = data.name;
  document.body.appendChild(elem);
  elem.querySelector('form').submit();
  document.body.removeChild(elem);
}

function makeHTML(data, asModule) {
  const files = data.files;
  const mainHTML = getOrFind(files, 'index.html', 'html');
  const mainJS = getOrFind(files, 'index.js', 'js', 'js', 'javascript');
  const mainCSS = getOrFind(files, 'index.css', 'css');
  const isModule = asModule !== undefined ? asModule : /\b(import|async|await)\b/.test(mainJS.content);
  const module = isModule
    ? ' type="module"'
    : '';
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeTextForHTMLContent(data.name)}</title>
    <style>
${mainCSS.content}
    </style>
  </head>
  <body>
${mainHTML.content}
  </body>
  <${'script'}${module}>
${mainJS.content}
  </${'script'}>
</html>
`;
}

export default class Export extends React.Component {
  constructor(props) {
    super(props);
    const mainJS = getOrFind(props.data.files, 'index.js', 'js', 'js', 'javascript');
    this.state = {
      asModule: /\bimport\b/.test(mainJS.content),  // random guess
    }
  }
  onChange = (asModule) => {
    this.setState({asModule});
  }
  exportToCodepen = () => {
    openInCodepen(this.props.data);
  }
  exportToJSFiddle = () => {
    openInJSFiddle(this.props.data);
  }
  saveToFile = () => {
    const {data} = this.props;
    const {asModule} = this.state;
    const html = makeHTML(data, asModule);
    const blob = new Blob([html], {type: 'text/html'});
    const filename = `jsgist-${data.name}.html`;
    saveData(blob, filename);
  }
  render() {
    const {data} = this.props;
    const {asModule} = this.state;
    return (
      <div>
        <button onClick={this.exportToCodepen}>Codepen</button>
        <button onClick={this.exportToJSFiddle}>JSFiddle</button>
        <p>StackOverflow Snippet (copy the code below paste into S.O.)</p>
        <div>
          <div><input type="radio" id="export-as-module" checked={asModule} onChange={_ => this.onChange(true)}/><label htmlFor="export-as-module">As es6 module</label></div>
          <div><input type="radio" id="export-as-script" checked={!asModule} onChange={_ => this.onChange(false)}/><label htmlFor="export-as-script">As script</label></div>
          <p>S.O. does not support es6 modules yet so picking "As Module" puts the code in a &lt;script&gt; in the HTML area.</p>
        </div>
        <div className="copy-text">
          <pre className="layout-scrollbar" style={{userSelect: 'all', overflow: 'auto', height: '5em'}}>{makeSnippet(data, asModule)}</pre>
          <div className="copy-buttons">
            <button type="button" onClick={() => navigator.clipboard.writeText(makeSnippet(data, asModule))}>copy</button>
          </div>
        </div>
        <p>HTML (copy the code below paste into a file)</p>
        <div>
          <div><input type="radio" id="export-as-module" checked={asModule} onChange={_ => this.onChange(true)}/><label htmlFor="export-as-module">As es6 module</label></div>
          <div><input type="radio" id="export-as-script" checked={!asModule} onChange={_ => this.onChange(false)}/><label htmlFor="export-as-script">As script</label></div>
        </div>
        <div className="copy-text">
          <pre className="layout-scrollbar" style={{userSelect: 'all', overflow: 'auto', height: '5em'}}>{makeHTML(data, asModule)}</pre>
          <div className="copy-buttons">
            <button type="button" onClick={this.saveToFile}>save</button>
            <button type="button" onClick={() => navigator.clipboard.writeText(makeHTML(data, asModule))}>copy</button>
          </div>
        </div>
      </div>
    );
  }
}