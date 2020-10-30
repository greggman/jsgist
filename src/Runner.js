import React from 'react';

import {isDevelopment} from './flags.js';
import ServiceContext from './ServiceContext.js';
import {createURL} from './url.js';
import * as winMsgMgr from './window-message-manager.js';

export default class Runner extends React.Component {
  constructor(props) {
    super(props);
    this.runnerRef = React.createRef();
  }
  handleJSLog = (data) => {
    const {logManager} = this.context;
    logManager.addMsg(data);
  }
  handleJSError = (data) => {
    const {logManager} = this.context;
    logManager.addMsg({...data, type: 'error'});
  }
  handleGimmeDaCodez = () => {
    this.iframe.contentWindow.postMessage({
      type: 'run',
      data: this.data,
    }, "*");
  }
  componentDidMount() {
    const {registerAPI} = this.props;
    registerAPI({
      run: (data, blank) => {
        this.data = data;
        this.removeIFrame();
        const iframe = document.createElement('iframe');
        this.iframe = iframe;
        iframe.src = isDevelopment
            ? createURL(`http://${window.location.hostname}:8081/runner-03.html`, {url: `http://${window.location.hostname}:8080/jsgist-runner.js`})
            : createURL('https://jsgistrunner.devcomments.org/runner-03.html', {url: 'https://jsgist.org/jsgist-runner.js'});
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
      this.iframe.src = 'about:blank';
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

Runner.contextType = ServiceContext;