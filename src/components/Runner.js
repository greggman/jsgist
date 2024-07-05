import React from 'react';

import {isDevelopment} from '../libs/flags.js';
import ServiceContext from '../ServiceContext.js';
import {createURL} from '../libs/url.js';
import * as winMsgMgr from '../libs/WindowMessageManager';

const allow = [
  'accelerometer',
  'bluetooth',
  'camera',
  'encrypted-media',
  'display-capture',
  'geolocation',
  'gyroscope',
  'microphone',
  'midi',
  'clipboard-read',
  'clipboard-write',
  'web-share',
  'serial',
  'xr-spatial-tracking',
].map(v => `${v} *`).join('; ');

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
    logManager.addMsg({...data, type: 'error', showStack: true});
  }
  handleJSUnhandledRejection = (data) => {
    const {logManager} = this.context;
    logManager.addMsg({...data, type: 'error', showStack: true});
  }
  handleInfoMessages = (data) => {
    const {logManager} = this.context;
    logManager.addMsgs(data);
  }
  handleGimmeDaCodez = () => {
    this.iframe.contentWindow.postMessage({
      type: 'run',
      data: this.data,
    }, "*");
  }
  componentDidMount() {
    const {registerAPI} = this.props;

    const {debug} = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    const extra = {
      ...(debug && {debug}),
    };

    registerAPI({
      run: (data, blank) => {
        this.data = data;
        this.removeIFrame();
        const iframe = document.createElement('iframe');
        iframe.allow = allow;        
        this.iframe = iframe;
        iframe.src = isDevelopment
            ? createURL(`http://${window.location.hostname}:8081/runner-03.html`, {url: `http://${window.location.hostname}:8080/jsgist-runner.js`, ...extra})
            : createURL('https://jsgistrunner.devcomments.org/runner-03.html', {url: 'https://jsgist.org/jsgist-runner.js', ...extra});
        if (blank) {
          iframe.style.background = 'none';
        }
        this.runnerRef.current.appendChild(iframe);
      },
    })
    winMsgMgr.on('gimmeDaCodez', null, this.handleGimmeDaCodez);
    winMsgMgr.on('jsLog', null, this.handleJSLog);
    winMsgMgr.on('jsError', null, this.handleJSError);
    winMsgMgr.on('jsUnhandledRejection', null, this.handleJSUnhandledRejection);
    winMsgMgr.on('infoMessages', null, this.handleInfoMessages);
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
    winMsgMgr.remove('gimmeDaCodez', null, this.handleGimmeDaCodez);
    winMsgMgr.remove('jsLog', null, this.handleJSLog);
    winMsgMgr.remove('jsError', null, this.handleJSError);
    winMsgMgr.remove('jsUnhandledRejection', null, this.handleJSUnhandledRejection);
    winMsgMgr.remove('infoMessages', null, this.handleInfoMessages);
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