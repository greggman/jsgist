import React from 'react';

export default class Runner extends React.Component {
  constructor(props) {
    super(props);
    this.runnerRef = React.createRef();
    this.handlers = {
      log: () => {

      },
      gimmeDaCodez: () => {
        this.iframe.contentWindow.postMessage({
          type: 'run',
          data: this.data,
        }, "*");
      },
    }
  }
  componentDidMount() {
    const {registerRunnerAPI} = this.props;
    registerRunnerAPI({
      run: (data, blank) => {
        this.data = data;
        this.removeIFrame();
        const iframe = document.createElement('iframe');
        this.iframe = iframe;
        iframe.sandbox = `
            allow-downloads
            allow-forms
            allow-modals
            allow-orientation-lock
            allow-pointer-lock
            allow-popups
            allow-presentation
            allow-scripts
            allow-top-navigation
        `;
        iframe.src = 'https://jsgistrunner.devcomments.org/runner.html';
        if (blank) {
          iframe.style.background = 'none';
        }
        this.runnerRef.current.appendChild(iframe);
      },
    })
    window.addEventListener('message', this.handleMessage);
  }
  removeIFrame() {
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = undefined;
    }
  }
  componentWillUnmount() {
    this.removeIFrame();
    window.removeEventListener('message', this.handleMessage);
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

