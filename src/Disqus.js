import React from 'react';
import {createURL} from './url.js';

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
  render() {
    const {disqusId, title} = this.props;
    const url = createURL('https://jsgist.devcomments.org/comments.html', {disqusId, title});
    return (
      <div>
        { disqusId ?
          <iframe
            ref={this.iframeRef}
            title="comments"
            src={url}
          /> : []
        }
      </div>
    );
  }
}