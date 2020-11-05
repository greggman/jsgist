import React from 'react';

import {getOrFind} from './utils.js';

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
  render() {
    const {data} = this.props;
    const {asModule} = this.state;
    return (
      <div>
        <button onClick={this.exportToCodepen}>Codepen</button>
        <button onClick={this.exportToJSFiddle}>JSFiddle</button>
        JSFiddle
        <p>StackOverflow Snippet (copy the code below paste into S.O.)</p>
        <div>
          <div><input type="radio" id="export-as-module" checked={asModule} onChange={_ => this.onChange(true)}/><label htmlFor="export-as-module">As es6 module</label></div>
          <div><input type="radio" id="export-as-script" checked={!asModule} onChange={_ => this.onChange(false)}/><label htmlFor="export-as-script">As script</label></div>
          <p>S.O. does not support es6 modules yet so picking "As Module" puts the code in a &lt;script&gt; in the HTML.</p>
        </div>
        <pre className="layout-scrollbar" style={{userSelect: 'all', overflow: 'auto', height: '5em'}}>{makeSnippet(data, asModule)}</pre>
      </div>
    );
  }
}