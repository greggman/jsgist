import React from 'react';
import {createURL} from './url.js';
import * as winMsgMgr from './window-message-manager.js';

// Disqus is served from a separate domain in an iframe. In other words
//
// +--[jsgist.org]-----------------------------+
// |                                           |
// | +--[iframe src=jsgist.devcomments.org]--+ |
// | |                                       | |
// | | +--[iframe src=disqus.com]---+        | |
// | | |                            |        | |
// | | +----------------------------+        | |
// | |                                       | |
// | +---------------------------------------+ |
// |                                           |
// +-------------------------------------------+
//
// This is because disqus works by embedded script
// so we can't let it be on our page directly
// otherwise it could read our secrets
//
export default class Disqus extends React.Component {
  constructor() {
    super();
    this.iframeRef = React.createRef();
  }
  // Disqus's script creates an iframe and the content in the iframe
  // communicates back to the main page to tell it the size of the iframe
  // so the main page can adjust the iframe size. We do that same thing
  // so our top page can just the size of the middle iframe in the
  // diagram above.
  handleResize = (data) => {
    this.iframeRef.current.style.height = `${data.height}px`;
  }
  componentDidMount() {
    winMsgMgr.on('resize', this.handleResize);
  }
  componentWillUnmount() {
    winMsgMgr.remove('resize', this.handleResize);
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.disqusId !== this.disqusId;
  }
  render() {
    const {disqusId, title} = this.props;
    const url = createURL('https://jsgist.devcomments.org/comments.html', {disqusId, title});
    return (
      <div>
        { !!disqusId &&
          <iframe
            ref={this.iframeRef}
            title="comments"
            src={url}
          />
        }
      </div>
    );
  }
}