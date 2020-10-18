import React from 'react';

import {isDevelopment} from './flags.js';
import * as winMsgMgr from './window-message-manager.js';

export default class Runner extends React.Component {
  constructor(props) {
    super(props);
    this.runnerRef = React.createRef();
  }
  handleJSLog = (data) => {
    this.props.logManager.addMsg(data.type, data.msg);
  }
  handleJSError = (data) => {

  }
  handleGimmeDaCodez = () => {
    this.iframe.contentWindow.postMessage({
      type: 'run',
      data: this.data,
    }, "*");
  }
  componentDidMount() {
    const {registerRunnerAPI} = this.props;
    registerRunnerAPI({
      run: (data, blank) => {
        this.data = data;
        this.removeIFrame();
        const iframe = document.createElement('iframe');
        this.iframe = iframe;
        iframe.src = isDevelopment
            ? 'http://localhost:8081/runner-02.html?development=true'
            : 'https://jsgistrunner.devcomments.org/runner-02.html';
        if (blank) {
          iframe.style.background = 'none';
        }
        this.runnerRef.current.appendChild(iframe);
      },
    })
    winMsgMgr.on('gimmeDaCodez', this.handleGimmeDaCodez);
    winMsgMgr.on('jsLog', this.handleJSLog);
    winMsgMgr.on('jsError', this.handleJSError);
  }
  removeIFrame() {
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = undefined;
    }
  }
  componentWillUnmount() {
    this.removeIFrame();
    winMsgMgr.remove('gimmeDaCodez', this.handleGimmeDaCodez);
    winMsgMgr.remove('jsLog', this.handleJSLog);
    winMsgMgr.remove('jsError', this.handleJSError);
  }
  handleMessage = (e) => {
    const {type, data} =  e.data;
    const fn = this.handlers[type];
    if (fn) {
      fn(data);
    }
  }
  render() {
    return (
      <div className="runner" ref={this.runnerRef}></div>
    )
  }
}

