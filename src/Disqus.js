import React from 'react';

const escape = s => JSON.stringify(s.replace(/</g, '(').replace(/>/g, ')'));

export default class Disqus extends React.Component {
  constructor() {
    super();
    this.iframeRef = React.createRef();
  }
  handleMessage = (e) => {
    const {type, data} = e.data;
    switch (type) {
      case 'resize':
        console.log('-got resize msg from comments.js--');
        this.iframeRef.current.style.height = `${data.height}px`;
        break;
      default:
        break;
    }
  }
  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.disqusId !== this.disqusId;
  }
  makeBlobURL() {
    this.disqusId = this.props.disqusId;
    const base = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : window.location.origin;

    const html = `
    <html>
      <link href="${base}/comments.css" rel="stylesheet">
      <body>
        <script crossorigin src="${base}/comments.js" type="module"></script>
        <div id="disqus_thread"></div>
        ${
          window.location.origin.indexOf('jsgist.org') < 0
          ? ''
          : `
          <script>
          var disqus_config = function () {
              this.page.url = '${this.disqusId}';
              this.page.identifier = '${escape(this.disqusId)}';
              this.page.title = '${escape(this.props.title)}';
          };
          </script>
          <script crossorigin src="https://${this.props.disqusShortName}.disqus.com/embed.js"></script>
          `
        }
        <a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>
      </body>
    </html>
    `;
    console.log(html);
    const blob = new Blob([html], {type: 'text/html'});
    return URL.createObjectURL(blob);
  }
  render() {
    return (
      <div ref={this.elemRef}>
        <iframe
          ref={this.iframeRef}
          title="comments"
          src={this.makeBlobURL()}
          sandbox="allow-scripts allow-forms allow-popups"
        />
      </div>
    );
  }
}