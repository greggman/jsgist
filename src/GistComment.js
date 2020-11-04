import React from 'react';

import Code from './Code.js';
import {isDevelopment} from './flags.js';
import ServiceContext from './ServiceContext.js';
import {createURL} from './url.js';
import * as winMsgMgr from './window-message-manager.js';

const helperUrl = isDevelopment
    ? 'http://localhost:8080/gist-comments.js'
    : `${window.location.origin}/gist-comments.js`;

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    this.show = props.show;
  }
  handleSendPreview = () => {
    const {body} = this.props;
    this.iframeRef.current.contentWindow.postMessage({type: 'preview', data: {body}}, '*');
  }
  handleResize = (data) => {
    this.iframeRef.current.style.height = `${data.height}px`;
  }
  componentDidMount() {
    winMsgMgr.on('sendPreview', this.iframeRef.current.contentWindow, this.handleSendPreview);
    winMsgMgr.on('resize', this.iframeRef.current.contentWindow, this.handleResize);
  }
  componentDidUpdate() {
    if (this.props.show !== this.show) {
      this.show = this.props.show;
      if (this.show) {
        this.handleSendPreview();
      }
    }
  }
  componentWillUnmount() {
    winMsgMgr.remove('sendPreview', this.iframeRef.current.contentWindow, this.handleSendPreview);
    winMsgMgr.remove('resize', this.iframeRef.current.contentWindow, this.handleResize);
  }
  render() {
    const url = createURL('https://jsgist.devcomments.org/gist-comments.html', {preview: true, url: helperUrl});
    return (
      <iframe title="comment-preview" ref={this.iframeRef} src={url} />
    );
  }
}

export default class GistComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: isDevelopment ? `# this is a test

\`\`\`js
const a = b + c;
\`\`\`

foo *bar* **moo** \`code\` etc...

1. this
2. that
3. other

* banana
* apple
* grape

\`\`\`html
<div>some long line that needs scrolling some long line that needs scrolling some long line that needs scrolling some long line that needs scrolling some long line that needs scrolling some long line that needs scrolling some long line that needs scrolling some long line that needs scrolling </div>
\`\`\`
` : '',
      tab: 0,
      previewKey: 1,
    };
  }
  onUserStatusChange = () => {
    this.forceUpdate();
  }
  componentDidMount() {
    const {userManager} = this.context;
    userManager.subscribe(this.onUserStatusChange);
  }
  componentWillUnmount() {
    const {userManager} = this.context;
    userManager.unsubscribe(this.onUserStatusChange);
  }
  onValueChange = (value) => {
    this.setState({value});
  }
  handleOnChange = (tab) => {
    this.setState({tab});
  }
  handleSaveComment = async() => {
    const {github, addError} = this.context;
    try {
      const {gistId, addComment} = this.props;
      const data = await github.createGistComment(gistId, this.state.value);
      this.setState({
        value: '',
        previewKey: this.state.previewKey + 1,
      });
      addComment(data);
    } catch (e) {
      addError(e.message || e);
    }
  }
  renderCommentForm() {
    const {userManager} = this.context;
    const userData = userManager.getUserData();
    const {
      value,
      tab,
      previewKey,
    } = this.state;
    const options = {
      editor: {
        mode: 'gfm',
        lineNumbers: false,
      },
    };
    const showPreview = tab === 1;
    return (
      <div className="new-comment">
        <div className="new-comment-head">
          {!!userData.login && <div className="username"><a target="_blank" rel="noopener noreferrer" href={`https://github.com/${userData.login}`}>{userData.login}</a></div>}
          {!!userData.avatar_url && <a className="user-avatar" target="_blank" rel="noopener noreferrer" href={`https://github.com/${userData.login}`}><img className="avatar" src={userData.avatar_url} alt="avatar"/></a>}
        </div>
        <div className="new-comment-tabs">
          <input
            type="radio"
            name="new-comment"
            id="write"
            checked={tab === 0}
            onChange={_ => this.handleOnChange(0)}
          />
          <label htmlFor="write">write</label>
          <input
            type="radio"
            name="new-comment"
            id="preview"
            checked={tab === 1}
            onChange={_ => this.handleOnChange(1)}
          />
          <label htmlFor="preview">preview</label>
        </div>
        <div className="new-comment-content">
          <div style={{...(tab === 1 && {display: 'none'})}} className="new-comment-write">
            <Code
              hackKey={previewKey}
              value={value}
              options={options}
              onValueChange={this.onValueChange}
              registerAPI={_ => _}
            />
          </div>
          <div className="new-comment-preview" style={{...(!showPreview && {display: 'none'})}}>
            <Preview key={previewKey} body={value} show={showPreview} />
          </div>
        </div>
        <div className="new-comment-submit  ">
          <button onClick={this.handleSaveComment}>Comment</button>
        </div>
      </div>
    );
  }
  renderLogin() {
    const {userManager} = this.context;
    return (
      <div className="new-comment">
        <button
          onClick={userManager.login}
        >Login with github</button>
      </div>
    )
  }
  render() {
    const {userManager} = this.context;
    const userData = userManager.getUserData();
    return (userData
      ? this.renderCommentForm()
      : this.renderLogin()
    );
  }
}

GistComment.contextType = ServiceContext;
