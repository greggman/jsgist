import React from 'react';

function find(files, endings) {
  // calling toLowerCase a bunch is bad but there will never be more than a few files
  for (const ending of endings) {
    const file = files.find(file => file.name.toLowerCase().endsWith(ending.toLowerCase()));
    if (file) {
      return file;
    }
  }
  return '';
}

function getOrFind(files, name, ...endings) {
  return files.find(f => f.name.toLowerCase() === name.toLowerCase) || find(files, endings);
}

export default class Runner extends React.Component {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
  }
  /*
  componentDidMount() {
    const elem = this.divRef.current;
    const handlers = {
      // error caught by window.addEventListener('error')
      log(data) {

      },
    }

    this.handleMessage = (e) => {
      const {type, data} =  e.data;
      handlers[type](data);
    };
    window.addEventListener('message', this.handleMessage);
    const blob = new Blob([html], {type: 'text/html'});
    iframe.sandbox = 'allow-scripts';
    iframe.src = URL.createObjectURL(blob);
    iframe.className = "snippet";
    elem.appendChild(iframe);
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = undefined;
    }
  }
  */
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.oldData);
  }
  makeBlobURL() {
    this.oldData = this.props.data;
    const data = JSON.parse(this.props.data);
    const files = data.files;
    const mainHTML = getOrFind(files, 'index.html', 'html');
    const mainJS = getOrFind(files, 'index.js', 'js', 'js', 'javascript');
    const mainCSS = getOrFind(files, 'index.css', 'css');
    const base = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : window.location.origin;
    const html = `
    <${'script'} type="module" src="${base}/console-wrapper.js"></${'script'}>
    <style>
    ${mainCSS.content}
    </style>
    <body>
    ${mainHTML.content}
    </body>
    <${'script'} type="module">
    ${mainJS.content}
    </${'script'}>
    `;
    const blob = new Blob([html], {type: 'text/html'});
    return URL.createObjectURL(blob);

  }
  render() {
    const url = this.makeBlobURL();
    const {blank} = this.props;
    return (
      <div className="runner" ref={this.divRef}>
        <iframe
          title="runner"
          sandbox="allow-scripts"
          src={url}
          style={{...(blank && {background: 'none'})}}/>
      </div>)
  }
}