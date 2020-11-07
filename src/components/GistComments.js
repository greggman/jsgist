import React from 'react';

import {isDevelopment} from '../libs/flags.js';
import ServiceContext from '../ServiceContext.js';
import {createURL} from '../libs/url.js';
import * as winMsgMgr from '../libs/WindowMessageManager';

const helperUrl = isDevelopment
    ? 'http://localhost:8080/gist-comments.js'
    : `${window.location.origin}/gist-comments.js`;


// Comments are served from a separate domain in an iframe.
// This is because comments have user data that is turned
// into HTML. Of course we should sanitize but if we have
// a bug we can't let it be on our page directly
// otherwise it could read our secrets
//
export default class GistComments extends React.Component {
  constructor() {
    super();
    this.iframeRef = React.createRef();
  }
  // Our script creates an iframe and the content in the iframe
  // communicates back to the main page to tell it the size of the content
  // so the main page can adjust the iframe size.
  handleResize = (data) => {
    this.iframeRef.current.style.height = `${data.height}px`;
  }
  addComment = (data) => {
    this.iframeRef.current.contentWindow.postMessage({
      type: 'addComment',
      data,
    }, '*');
  }
  componentDidMount() {
    winMsgMgr.on('resize', this.iframeRef.current.contentWindow, this.handleResize);
    this.props.registerAPI({
      addComment: this.addComment,
    });
  }
  componentWillUnmount() {
    winMsgMgr.remove('resize', this.iframeRef.current.contentWindow, this.handleResize);
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.disqusId !== this.disqusId;
  }
  render() {
    const {userManager} = this.context;
    const userData = userManager.getUserData() || {};
    const {gistId} = this.props;
    const url = createURL('https://jsgist.devcomments.org/gist-comments.html', {gist_id: gistId, url: helperUrl, gitUserId: userData.id});
    return (
      <div>
        { !!gistId &&
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

GistComments.contextType = ServiceContext;
